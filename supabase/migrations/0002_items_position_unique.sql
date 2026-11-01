-- Two items at the same position in one curriculum is meaningless, and the
-- unique key makes seeds idempotent (on conflict (curriculum_id, position)).
alter table items
  add constraint items_curriculum_position_key unique (curriculum_id, position);
