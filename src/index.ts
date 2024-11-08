import type { LyricData } from "./type";
import { createRegExp, digit, exactly, letter, oneOrMore } from "magic-regexp";

function parseTimeTag(timeTag: string): number {
    const [min, sec] = timeTag.split(":").map(parseFloat);
    return min * 60 + sec;
}

export default function parseLRC(lrcText: string, duration?: number): LyricData {
    const lines = lrcText.split("\n");
    const result: LyricData = { scripts: [] };

    for (const line of lines) {
        const metadataRegex = createRegExp(
            exactly("[", exactly(oneOrMore(letter)).as("key"), ":", exactly(exactly(oneOrMore(letter))).as("value"), "]")
        )
        const metadataMatch = metadataRegex.exec(line);
        if (metadataMatch && metadataMatch.groups && metadataMatch.groups.key && metadataMatch.groups.value) {
            const key = metadataMatch.groups.key.trim().toLowerCase();
            const value = metadataMatch.groups.value.trim();
            (result as any)[key] = value;
            continue;
        }

        const lyricTimetagRegex = createRegExp(
            "[",
            exactly(digit.times(2), ":", digit.times(2), ".", digit.times.between(2, 3)).as("timeTag"),
            "]",
        );
        const lineMatch = lyricTimetagRegex.exec(line);
        if (!lineMatch || !lineMatch.groups || !lineMatch.groups.timeTag) continue;
        const start = parseTimeTag(lineMatch.groups.timeTag);
        const text = line.replace(lineMatch[0], "");
        result.scripts!.push({ start, end: -1, text });
    }

    // Calculate end times based on the next line's start time
    for (let i = 0; i < result.scripts!.length - 1; i++) {
        result.scripts![i].end = result.scripts![i + 1].start;
    }

    // Remove empty scripts
    result.scripts = result.scripts!.filter((script) => script.text.trim() !== "");

    // Set the last line end time to the start time +3s (by default)
    if (result.scripts!.length > 0) {
        result.scripts![result.scripts!.length - 1].end = result.scripts![result.scripts!.length - 1].start + 3;
    }

    // Optional: If the duration is provided and the last line's end time is not set (-1), 
    // set the end time of the last script
    if (duration && result.scripts!.length > 0 && result.scripts![result.scripts!.length - 1].end === -1) {
        result.scripts![result.scripts!.length - 1].end = duration;
    }

    return result;
}