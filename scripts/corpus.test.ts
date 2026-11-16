import { describe, it, expect } from "vitest";
import { parseItems, serializeItems, type ItemRow } from "./corpus";

describe("corpus parse/serialize", () => {
  const sample: ItemRow[] = [
    { position: 1, prompt: "你好", answer: "hello", meta: { pinyin: "nǐ hǎo" } },
    { position: 2, prompt: 'say "hi, there"', answer: "a, with comma", meta: {} },
  ];

  it("round-trips records -> CSV -> records unchanged", () => {
    const parsed = parseItems(serializeItems(sample));
    expect(parsed).toEqual(sample);
  });

  it("serialize is deterministic and sorts by position", () => {
    const shuffled = [sample[1], sample[0]];
    expect(serializeItems(shuffled)).toBe(serializeItems(sample));
  });

  it("handles CJK, commas, and quotes via RFC-4180 quoting", () => {
    const csv = serializeItems(sample);
    expect(parseItems(csv)[1].prompt).toBe('say "hi, there"');
  });

  it("empty meta serializes as {} and parses back to {}", () => {
    expect(parseItems(serializeItems([sample[1]]))[0].meta).toEqual({});
  });

  it("fails loudly on a non-integer position", () => {
    expect(() => parseItems("position,prompt,answer,meta_json\nx,a,b,{}")).toThrow(/position must be an integer/);
  });

  it("fails loudly on duplicate positions", () => {
    expect(() => parseItems("position,prompt,answer,meta_json\n1,a,b,{}\n1,c,d,{}")).toThrow(/duplicate position/);
  });

  it("fails loudly on missing prompt/answer", () => {
    expect(() => parseItems("position,prompt,answer,meta_json\n1,,b,{}")).toThrow(/required/);
  });

  it("fails loudly on invalid meta_json", () => {
    expect(() => parseItems("position,prompt,answer,meta_json\n1,a,b,{bad}")).toThrow(/not valid JSON/);
  });
});
