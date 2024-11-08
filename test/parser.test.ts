import { expect, test } from "bun:test";
import parseLRC from "src/index";

const lrcText = `
[ar:Artist]
[ti:Title]
[00:12.00]First line of lyrics
[00:15.00]Second line of lyrics
[00:17.00]
[00:20.00]Third line of lyrics
`;
test("parser", async () => {
    const parsedLyricData = parseLRC(lrcText);
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
    })
});
