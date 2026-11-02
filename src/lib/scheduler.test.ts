import { describe, it, expect } from "vitest";
import { sm2State, sm2Scheduler, type Grade } from "./scheduler";

describe("sm2State", () => {
  it("grows the interval with repeated good grades", () => {
    const s = sm2State([2, 2, 2]);
    expect(s.interval).toBeGreaterThan(6); // 1 -> 6 -> ~15
    expect(s.ease).toBeGreaterThanOrEqual(2.5);
  });

  it("resets interval to 1 on a lapse (again), regardless of prior growth", () => {
    expect(sm2State([2, 2, 2, 0]).interval).toBe(1);
  });

  it("floors ease at 1.3 under repeated failures", () => {
    expect(sm2State([0, 0, 0, 0, 0]).ease).toBe(1.3);
  });

  it("starts fresh: first good review is a 1-day interval", () => {
    expect(sm2State([2]).interval).toBe(1);
  });
});

describe("sm2Scheduler", () => {
  it("schedules next_due in the future for a passing grade", () => {
    const { nextDue, predictedRecall } = sm2Scheduler.next([], 2 as Grade);
    expect(nextDue.getTime()).toBeGreaterThan(Date.now());
    expect(predictedRecall).toBeGreaterThan(0);
    expect(predictedRecall).toBeLessThanOrEqual(0.99);
  });

  it("is registered under its name", () => {
    expect(sm2Scheduler.name).toBe("sm2");
  });
});
