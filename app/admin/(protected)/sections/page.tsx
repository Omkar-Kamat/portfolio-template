"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";

type Section = {
  id: string;
  type: string;
  title: string | null;
  enabled: number;
  order: number;
};

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/sections")
      .then((r) => r.json())
      .then((data) => {
        setSections(data);
        setLoading(false);
      });
  }, []);

  async function toggle(id: string, enabled: boolean) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: enabled ? 1 : 0 } : s)));
    await fetch("/api/admin/sections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled }),
    });
  }

  async function move(index: number, direction: -1 | 1) {
    const next = [...sections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    setSaving(true);
    await fetch("/api/admin/sections/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((s) => s.id) }),
    });
    setSaving(false);
  }

  if (loading) return <p className="text-neutral-500 text-sm">Loading…</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Sections</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Toggle visibility and reorder how sections appear on your public portfolio. {saving && "Saving…"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
        {sections.map((section, idx) => (
          <div key={section.id} className="flex items-center gap-4 px-4 py-3.5 bg-white/[0.02]">
            <GripVertical size={16} className="text-neutral-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium capitalize">{section.title || section.type}</p>
              <p className="text-xs text-neutral-500">{section.type}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => move(idx, 1)}
                disabled={idx === sections.length - 1}
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition"
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <button
              onClick={() => toggle(section.id, !section.enabled)}
              className={`shrink-0 relative w-11 h-6 rounded-full transition ${
                section.enabled ? "bg-emerald-500" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  section.enabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
