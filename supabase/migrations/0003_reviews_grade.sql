-- The raw grade (0..3) is part of the observation (principle 4) and is what
-- SM-2/FSRS replay to reconstruct scheduler state. R-002 logged only the
-- derived actual_recall; schedulers need the grade itself.
alter table reviews add column grade smallint;
