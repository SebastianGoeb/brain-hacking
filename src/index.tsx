/* @refresh reload */
import { render } from "solid-js/web";
import { createResource, For, Show } from "solid-js";
import { supabase } from "./lib/supabase";

type Curriculum = { id: string; title: string; subject: string; description: string | null };

async function fetchCurricula(): Promise<Curriculum[]> {
  const { data, error } = await supabase
    .from("curricula")
    .select("id, title, subject, description")
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

function App() {
  const [curricula] = createResource(fetchCurricula);
  return (
    <main style={{ "font-family": "system-ui", "max-width": "40rem", margin: "2rem auto" }}>
      <h1>Brain Hacking</h1>
      <Show when={curricula.error}>
        <p style={{ color: "crimson" }}>Error: {String(curricula.error?.message ?? curricula.error)}</p>
      </Show>
      <Show when={!curricula.loading && (curricula()?.length ?? 0) === 0}>
        <p>No curricula yet. Run <code>supabase/schema.sql</code> and add one.</p>
      </Show>
      <ul>
        <For each={curricula()}>
          {(c) => <li><strong>{c.title}</strong> <em>({c.subject})</em> — {c.description}</li>}
        </For>
      </ul>
    </main>
  );
}

render(() => <App />, document.getElementById("root")!);
