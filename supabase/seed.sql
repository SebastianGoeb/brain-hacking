-- Applied automatically by `supabase start` / `supabase db reset`.
-- One public curriculum so a fresh local DB (and e2e) has something to review.
with c as (
  insert into curricula (slug, title, subject, description, is_public, owner)
  values ('demo', 'Demo Deck', 'test', 'Proves the read path + public RLS.', true, null)
  returning id
)
insert into items (curriculum_id, position, prompt, answer)
select c.id, v.position, v.prompt, v.answer
from c, (values
  (1, 'What is this app really?', 'An experiment platform; I am the test subject.'),
  (2, 'Second demo card', 'So e2e can check the due queue with more than one item.')
) as v(position, prompt, answer);
