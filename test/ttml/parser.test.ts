import { expect, test } from "bun:test";
import parseTTML from "src/ttml/parser";

const file1 = Bun.file("test/ttml/assets/example-apple-1.ttml");
const file2 = Bun.file("test/ttml/assets/example-amll-2.ttml");
const file3 = Bun.file("test/ttml/assets/example-amll-1.ttml");
const file4 = Bun.file("test/ttml/assets/example-amll-3.ttml");
const TTML_apple_1 = await file1.text();
const TTML_amll_2 = await file2.text();
const TTML_amll_1 = await file3.text();
const TTML_amll_3 = await file4.text();

test("Regular TTML", async () => {
    const parsedLyricData1 = parseTTML(TTML_apple_1);
    const parsedLyricData2 = parseTTML(TTML_amll_1);
    expect(parsedLyricData1.scripts![2].text).toBe("史笔滔滔烟霞绣像");
    expect(parsedLyricData2.scripts![2].text).toBe("史笔滔滔烟霞绣像");
});

test("TTML with background vocal", async () => {
    const parsedLyricData2 = parseTTML(TTML_amll_2);
    expect(parsedLyricData2.scripts![59].text).toBe("岸上游人挽手相依熙熙攘攘");
    expect(parsedLyricData2.scripts![0].words![0].word).toBe("临水");
});

test("TTML containing timespan with hour", async () => {
    const parsedLyricData1 = parseTTML(TTML_amll_3);
    expect(parsedLyricData1.scripts![0].start).toEqual(21.66);
});
