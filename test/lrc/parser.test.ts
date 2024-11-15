import { expect, test } from "bun:test";
import parseLRC from "src/lrc/parser";

const lrcText1 = `
[ar:Artist]
[ti:Title]
[00:12.00]First line of lyrics
[00:15.00]Second line of lyrics
[00:17.00]
[00:20.00]Third line of lyrics
`;

const lrcText2 = `
[ti:Song Title]
[00:00.00]Lyric line 1
[00:02.00]
[00:03.00]Lyric line 2
`;
test("Regular LRC", async () => {
    const parsedLyricData = parseLRC(lrcText1);
    expect(parsedLyricData).toEqual({
        ar: "Artist",
        ti: "Title",
        scripts: [
            {
                start: 12,
                end: 15,
                text: "First line of lyrics",
            },
            {
                start: 15,
                end: 17,
                text: "Second line of lyrics",
            },
            {
                start: 20,
                end: 23,
                text: "Third line of lyrics",
            },
        ],
    });
});

test("Call with provided duration", async () => {
    const parsedLyricData = parseLRC(lrcText2, 4);
    expect(parsedLyricData).toEqual({
        scripts: [
            {
                start: 0,
                end: 2,
                text: "Lyric line 1",
            },
            {
                start: 3,
                end: 4,
                text: "Lyric line 2",
            },
        ],
    });
});
