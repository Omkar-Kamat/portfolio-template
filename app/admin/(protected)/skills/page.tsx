"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

type Skill = { id: string; name: string; category: string };

const CATEGORIES = ["Frontend", "Backend", "Languages", "Databases", "DevOps", "AI/ML", "Tools"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  function load() {
    fetch("/api/admin/skills")
      .then((r) => r.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category }),
    });
    setName("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    load();
  }

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0 || g.cat === category);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <p className="text-neutral-500 text-sm mt-1">Organized by category.</p>
      </div>

      <form onSubmit={add} className="flex flex-wrap gap-2 mb-8">
        <input
          className="flex-1 min-w-40 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60 transition"
          placeholder="Skill name, e.g. TypeScript"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60 transition"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black text-sm font-medium px-3.5 py-2 hover:bg-neutral-200 transition"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : (
        <div className="space-y-6">
          {grouped.map((g) => (
            <div key={g.cat}>
              <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">{g.cat}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.length === 0 && <p className="text-xs text-neutral-600">No skills yet</p>}
                {g.items.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs"
                  >
                    {s.name}
                    <button onClick={() => remove(s.id)} className="text-neutral-500 hover:text-red-400 transition">
                      <Trash2 size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
