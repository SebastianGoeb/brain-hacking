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

// ponytail: trivial fixed-interval stub. Real strategies (FSRS etc.) are R-004.
export const stubScheduler: Scheduler = {
  name: "stub-fixed",
  next(history, grade) {
    const days = grade === 0 ? 0 : Math.min(2 ** history.length, 365);
    const nextDue = new Date(Date.now() + days * 86_400_000);
    return { nextDue, predictedRecall: grade === 0 ? 0.3 : 0.9 };
  },
};

// Registry: the player picks a strategy by name and records that name on every
// review (principle 4). Adding FSRS/SM-2 later = one entry here, no player change.
export const schedulers: Record<string, Scheduler> = {
  [stubScheduler.name]: stubScheduler,
};

