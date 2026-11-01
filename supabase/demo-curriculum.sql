-- A richer demo curriculum for the hosted (prod) DB. Paste into the Supabase
-- SQL editor of the hosted project. Idempotent on curricula.slug.
-- (Local already seeds a minimal deck via supabase/seed.sql for e2e.)
--
-- Content is Mandarin, exercising items.meta (pinyin) — the subject escape
-- hatch (principle 1). Swap freely; this is just demo content.

insert into curricula (slug, title, subject, description, is_public, owner)
values ('mandarin-starter', 'Mandarin Starter', 'mandarin',
        'A handful of everyday words to try the review loop.', true, null)
on conflict (slug) do update
  set title = excluded.title, description = excluded.description;

with c as (select id from curricula where slug = 'mandarin-starter')
insert into items (curriculum_id, position, prompt, answer, meta)
select c.id, v.position, v.prompt, v.answer, v.meta
from c, (values
  (1, '你好', 'hello',        '{"pinyin":"nǐ hǎo"}'::jsonb),
  (2, '谢谢', 'thank you',    '{"pinyin":"xiè xie"}'::jsonb),
  (3, '再见', 'goodbye',      '{"pinyin":"zài jiàn"}'::jsonb),
  (4, '水',   'water',        '{"pinyin":"shuǐ"}'::jsonb),
  (5, '茶',   'tea',          '{"pinyin":"chá"}'::jsonb),
  (6, '吃',   'to eat',       '{"pinyin":"chī"}'::jsonb)
) as v(position, prompt, answer, meta)
on conflict (curriculum_id, position) do update
  set prompt = excluded.prompt, answer = excluded.answer, meta = excluded.meta;
