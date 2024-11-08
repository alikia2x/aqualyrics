import type { LyricData } from "../type";
import { createRegExp, digit, exactly, letter, oneOrMore } from "magic-regexp";

function parseTimeTag(timeTag: string): number {
    const [min, sec] = timeTag.split(":").map(parseFloat);
    return min * 60 + sec;
}

/**
 * Parses an LRC text string into structured lyric data.
 * @function parseLRC
 * @param {string} lrcText - The LRC text to parse.
 * @param {number} [duration] - Optional duration in seconds to use for determining the end time of the last script.
 * @returns {LyricData} The parsed lyric data.
 */
export default function parseLRC(lrcText: string, duration?: number): LyricData {
    const lines = lrcText.split("\n");
    const result: LyricData = { scripts: [] };

    const metadataRegex = createRegExp(
        exactly("[", exactly(oneOrMore(letter)).as("key"), ":", exactly(oneOrMore(letter)).as("value"), "]")
    );

    const lyricTimetagRegex = createRegExp(
        "[",
        exactly(digit.times(2), ":", digit.times(2), ".", digit.times.between(2, 3)).as("timeTag"),
        "]"
    );

    const scripts = result.scripts!;

    for (const line of lines) {
        const metadataMatch = metadataRegex.exec(line);
        if (metadataMatch && metadataMatch.groups) {
            const key = metadataMatch.groups.key.trim().toLowerCase();
            const value = metadataMatch.groups.value.trim();
            (result as any)[key] = value;
            continue;
        }

        const lineMatch = lyricTimetagRegex.exec(line);
        if (!lineMatch || !lineMatch.groups) continue;

        const start = parseTimeTag(lineMatch.groups.timeTag);
        const text = line.replace(lineMatch[0], "").trim();
        scripts.push({ start, end: -1, text });
    }

    // Calculate end times based on the next line's start time
    for (let i = 0; i < scripts.length - 1; i++) {
        scripts[i].end = scripts[i + 1].start;
    }

    // Remove empty scripts
    result.scripts = result.scripts!.filter((script) => script.text.trim() !== "");

    // Set the last line end time to the start time +3s (by default)
    if (scripts.length > 0) {
        scripts[scripts.length - 1].end = scripts[scripts.length - 1].start + 3;
    }

    // Optional: If the duration is provided and the last line's end time is not set (-1), 
    // set the end time of the last script
    if (duration && scripts.length > 0 && scripts[scripts.length - 1].end === -1) {
        scripts[scripts.length - 1].end = duration;
    }

    return result;
}