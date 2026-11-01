// Spine invariant (principle 3): scheduling is an interface, never hardcoded.
// Every strategy — FSRS (R-004), SM-2, custom, fixed-order — implements this.
// The first impl is a deliberate 5-line stub; it still goes behind the interface.

export type Grade = 0 | 1 | 2 | 3; // again / hard / good / easy

export interface Review {
  reviewedAt: Date;
  grade: Grade;
}

export interface Scheduler {
  readonly name: string;
  /** Given an item's review history and the latest grade, when is it next due? */
  next(history: Review[], grade: Grade): { nextDue: Date; predictedRecall: number };
}

// ponytail: trivial fixed-interval stub. Real strategies are sm2 (R-004) / fsrs (R-014).
export const stubScheduler: Scheduler = {
  name: "stub-fixed",
  next(history, grade) {
    const days = grade === 0 ? 0 : Math.min(2 ** history.length, 365);
    const nextDue = new Date(Date.now() + days * 86_400_000);
    return { nextDue, predictedRecall: grade === 0 ? 0.3 : 0.9 };
  },
};

// SM-2 (SuperMemo 2). Stateless: ease + interval are replayed from the grade
// history each call, so no extra DB columns — the reviews log is the state.
// Grade maps again=0, hard=1, good=2, easy=3 onto SM-2's 0..5 quality scale.
const SM2_QUALITY: Record<Grade, number> = { 0: 2, 1: 3, 2: 4, 3: 5 };

function sm2State(grades: Grade[]): { interval: number; ease: number } {
  let ease = 2.5;
  let interval = 0;
  let reps = 0;
  for (const g of grades) {
    const q = SM2_QUALITY[g];
    if (q < 3) {
      reps = 0;
      interval = 1; // lapse: back to 1 day
    } else {
      reps += 1;
      interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(interval * ease);
    }
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  }
  return { interval, ease };
}

export const sm2Scheduler: Scheduler = {
  name: "sm2",
  next(history, grade) {
    const grades = [...history.map((r) => r.grade), grade];
    const { interval, ease } = sm2State(grades);
    const nextDue = new Date(Date.now() + interval * 86_400_000);
    // predictedRecall: cheap proxy from ease (not SM-2 native; good enough to log).
    const predictedRecall = grade === 0 ? 0.3 : Math.min(0.99, 0.5 + (ease - 1.3) / 2.4);
    return { nextDue, predictedRecall };
  },
};

// Registry: the player picks a strategy by name and records that name on every
// review (principle 4). Adding fsrs later = one entry here, no player change.
export const schedulers: Record<string, Scheduler> = {
  [stubScheduler.name]: stubScheduler,
  [sm2Scheduler.name]: sm2Scheduler,
};

// Runnable self-check (meta-principle: non-trivial logic leaves one check).
// Run with: npx tsx src/lib/scheduler.ts  (guarded so it never runs in the app)
declare const process: { argv: string[] } | undefined;
if (typeof process !== "undefined" && import.meta.url === `file://${process.argv[1]}`) {
  const g = (grades: Grade[]) => sm2State(grades);
  // All-good: intervals grow 1 -> 6 -> ~15, ease stays >= start.
  const good = g([2, 2, 2]);
  console.assert(good.interval > 6, "3x good should exceed 6-day interval");
  console.assert(good.ease >= 2.5, "good reviews should not drop ease below start");
  // A lapse resets interval to 1 regardless of prior growth.
  console.assert(g([2, 2, 2, 0]).interval === 1, "again must reset interval to 1");
  // Ease floor holds under repeated failures.
  console.assert(g([0, 0, 0, 0, 0]).ease === 1.3, "ease must floor at 1.3");
  console.log("sm2 self-check passed");
}

