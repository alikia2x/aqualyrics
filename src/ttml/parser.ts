import type { LyricData, LyricWord, ScriptItem } from "src/type";
import xmldoc from "xmldoc";

const AMLL_METADATA_KEY_MAP = {
    musicName: "ti",
    artists: "ar",
    album: "al",
    ttmlAuthorGithub: "aligner",
    spotifyId: "spotifyID",
    ncmMusicId: "neteaseMusicID",
    qqMusicID: "qqMusicID",
    appleMusicID: "appleMusicID",
};

function extractMetadata(metadata: xmldoc.XmlElement, data: LyricData): LyricData {
    let result: LyricData = {};
    const AMLLMetaElements = metadata.childrenNamed("amll:meta");
    for (const element of AMLLMetaElements) {
        const key = element.attr.key;
        const value = element.attr.value;
        if (!key || !value) continue;
        if (key in AMLL_METADATA_KEY_MAP) {
            const aquaLyricsKey = AMLL_METADATA_KEY_MAP[key as keyof typeof AMLL_METADATA_KEY_MAP];
            result[aquaLyricsKey] = value;
        } else {
            result[key] = value;
        }
    }
    return { ...data, ...result };
}

/**
 * Parse a time string in the format "hh:mm:ss.mmm" into number in seconds, in which
 * the milliseconds and hours are optional.
 * @param time  The time string to parse.
 */
function parseTime(time: string): number {
    const colonSplited = time.split(":");
    const dotSplited = time.split(".");
    const hours = colonSplited.length > 1 ? parseInt(colonSplited[0]) : 0;
    const minutes = colonSplited.length > 1 ? parseInt(colonSplited[1]) : parseInt(colonSplited[0]);
    const seconds = dotSplited.length > 1 ? parseInt(dotSplited[0]) : 0;
    const milliseconds = dotSplited.length > 1 ? parseInt(dotSplited[1]) : 0;
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

function getDuration(element: xmldoc.XmlElement): string | undefined {
    const bodyElement = element.descendantWithPath("body");
    if (!bodyElement) return undefined;
    const durationExists = !!element.attr.dur;
    return durationExists ? element.attr.dur : undefined;
}

function processLyricLine(element: xmldoc.XmlElement, data: LyricData): LyricData {
    const spanElements = element.childrenNamed("span");
    const wordExists = !!spanElements.length;
    const idx = element.attr["itunes:key"];
    let singleLine: ScriptItem = {
        start: 0,
        end: 0,
        text: "",
    };
    singleLine.start = parseTime(element.attr.begin);
    singleLine.end = parseTime(element.attr.end);
    if (!wordExists) {
        singleLine.text = element.val;
    } else {
        let words: LyricWord[] = [];
        for (const span of spanElements) {
            if (span.attr["ttm:role"]) continue;
            singleLine.text += span.val;
            words.push({
                startTime: parseTime(span.attr.begin),
                endTime: parseTime(span.attr.end),
                word: span.val,
            })
        }
        singleLine.words = words;
    }
    if (idx)
        singleLine.idx = parseInt(idx.substring(1)); // remove the leading "L"
    if (data.scripts) {
        data.scripts.push(singleLine);
    } else {
        data.scripts = [singleLine];
    }
    return data;
}

function processLyricGroup(element: xmldoc.XmlElement, data: LyricData): LyricData {
    let result: LyricData = {};
    const lyricLines = element.childrenNamed("p");
    for (const line of lyricLines) {
        data = { ...result, ...processLyricLine(line, data) };
    }
    return { ...data, ...result };
}

function processLyricGroups(lyricGroups: xmldoc.XmlElement[], data: LyricData): LyricData {
    let result: LyricData = {};
    for (const group of lyricGroups) {
        result = { ...result, ...processLyricGroup(group, result) };
    }
    return { ...data, ...result };
}

/**
 * Parse a TTML XML string into lyric data.
 * @param xml The XML string to parse.
 * @returns The parsed lyric data.
 */
export default function parseTTML(xml: string): LyricData {
    const parsedData = new xmldoc.XmlDocument(xml);
    let result: LyricData = {};
    const metadata = parsedData.descendantWithPath("head.metadata");
    const bodyElement = parsedData.descendantWithPath("body");
    if (metadata) {
        result = extractMetadata(metadata, result);
    }
    const parsedDuration = getDuration(parsedData);
    if (parsedDuration) {
        result.length = parsedDuration;
    }
    if (bodyElement) {
        const lyricGroups = bodyElement.childrenNamed("div");
        result = processLyricGroups(lyricGroups, result);
    }
    if (result.scripts) {
        result.scripts = result.scripts.sort((a, b) => {
            if (a.idx && b.idx) {
                return a.idx - b.idx;
            }
            return a.start - b.start;
        });
    }
    return result;
}
