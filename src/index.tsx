/* @refresh reload */
import { render } from "solid-js/web";
import { createResource, createSignal, For, Show } from "solid-js";
import { supabase, ensureUser } from "./lib/supabase";
import { stubScheduler, type Grade } from "./lib/scheduler";

type Curriculum = { id: string; title: string; subject: string; description: string | null };
type Item = { id: string; prompt: string; answer: string };

const GRADES: { g: Grade; label: string }[] = [
  { g: 0, label: "Again" },
  { g: 1, label: "Hard" },
  { g: 2, label: "Good" },
  { g: 3, label: "Easy" },
];

async function fetchCurricula(): Promise<Curriculum[]> {
  const { data, error } = await supabase
    .from("curricula")
    .select("id, title, subject, description")
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

async function fetchItems(curriculumId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("id, prompt, answer")
    .eq("curriculum_id", curriculumId)
    .order("position");
  if (error) throw error;
  return data ?? [];
}

// R-002 spine invariant: next-due comes from the Scheduler interface, and every
// review writes a *complete* observation row (strategy, predicted/actual, latency).
async function recordReview(item: Item, grade: Grade, latencyMs: number) {
  const { nextDue, predictedRecall } = stubScheduler.next([], grade);
  const { error } = await supabase.from("reviews").insert({
    item_id: item.id,
    strategy: stubScheduler.name,
    predicted_recall: predictedRecall,
    actual_recall: grade === 0 ? 0 : 1, // ponytail: binary recall; refine with grade when a strategy needs it
    latency_ms: latencyMs,
    next_due: nextDue.toISOString(),
  });
  if (error) throw error;
}

function Player(props: { curriculum: Curriculum; onExit: () => void }) {
  const [items] = createResource(() => props.curriculum.id, fetchItems);
  const [idx, setIdx] = createSignal(0);
  const [revealed, setRevealed] = createSignal(false);
  const [shownAt, setShownAt] = createSignal(Date.now());
  const [error, setError] = createSignal<string>();

  const current = () => items()?.[idx()];
  const done = () => !items.loading && idx() >= (items()?.length ?? 0);

  async function grade(g: Grade) {
    const item = current();
    if (!item) return;
    try {
      await recordReview(item, g, Date.now() - shownAt());
      setRevealed(false);
      setShownAt(Date.now());
      setIdx(idx() + 1);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  return (
    <section>
      <button onClick={props.onExit}>← back</button>
      <h2>{props.curriculum.title}</h2>
      <Show when={error()}>
        <p style={{ color: "crimson" }}>Error: {error()}</p>
      </Show>
      <Show when={done()}>
        <p>Done — reviewed {items()?.length ?? 0} item(s).</p>
      </Show>
      <Show when={current()} keyed>
        {(item) => (
          <div>
            <p style={{ "font-size": "1.25rem" }}>{item.prompt}</p>
            <Show
              when={revealed()}
              fallback={<button onClick={() => setRevealed(true)}>Reveal</button>}
            >
              <p style={{ color: "#444" }}>{item.answer}</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <For each={GRADES}>
                  {({ g, label }) => <button onClick={() => grade(g)}>{label}</button>}
                </For>
              </div>
            </Show>
            <p style={{ color: "#999", "font-size": "0.85rem" }}>
              {idx() + 1} / {items()?.length}
            </p>
          </div>
        )}
      </Show>
    </section>
  );
}

function App() {
  const [ready] = createResource(ensureUser);
  const [curricula] = createResource(ready, fetchCurricula);
  const [active, setActive] = createSignal<Curriculum>();

  return (
    <main style={{ "font-family": "system-ui", "max-width": "40rem", margin: "2rem auto" }}>
      <h1>Brain Hacking</h1>
      <Show when={ready.error}>
        <p style={{ color: "crimson" }}>Auth error: {String(ready.error?.message ?? ready.error)} — enable Anonymous sign-ins in Supabase.</p>
      </Show>
      <Show when={curricula.error}>
        <p style={{ color: "crimson" }}>Error: {String(curricula.error?.message ?? curricula.error)}</p>
      </Show>
      <Show when={active()} keyed fallback={
        <ul>
          <For each={curricula()}>
            {(c) => (
              <li>
                <button onClick={() => setActive(c)}><strong>{c.title}</strong></button>{" "}
                <em>({c.subject})</em> — {c.description}
              </li>
            )}
          </For>
        </ul>
      }>
        {(c) => <Player curriculum={c} onExit={() => setActive(undefined)} />}
      </Show>
    </main>
  );
}

render(() => <App />, document.getElementById("root")!);
