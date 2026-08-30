"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

type Experience = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
};

const emptyForm = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "Present",
  description: "",
  technologies: "",
};

export default function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/admin/experiences")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    setSaving(true);
    await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: items.length }),
    });
    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this experience entry?")) return;
    await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Experience</h1>
          <p className="text-neutral-500 text-sm mt-1">Your work history, most recent first.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black text-sm font-medium px-3.5 py-2 hover:bg-neutral-200 transition"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl border border-white/10 p-5 mb-6 space-y-4 bg-white/[0.02]">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className={inputClass}
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className={inputClass}
                placeholder="Start (e.g. Jun 2024)"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="End (or Present)"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="Description / achievements"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Technologies (comma separated)"
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-white text-black text-sm font-medium px-4 py-2 hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add experience"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-neutral-500 text-sm">
          No experience entries yet.
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 px-4 py-4 bg-white/[0.02]">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {item.role} · <span className="text-neutral-400">{item.company}</span>
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {item.startDate} — {item.endDate}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                {item.description && <p className="text-xs text-neutral-400 mt-2">{item.description}</p>}
              </div>
              <button
                onClick={() => remove(item.id)}
                className="shrink-0 p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60 transition";
