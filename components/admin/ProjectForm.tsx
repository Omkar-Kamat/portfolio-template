"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProjectFormData = {
  id?: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string;
  featured: boolean;
  published: boolean;
};

const empty: ProjectFormData = {
  title: "",
  slug: "",
  shortDesc: "",
  description: "",
  image: "",
  githubUrl: "",
  liveUrl: "",
  technologies: "",
  featured: false,
  published: true,
};

export default function ProjectForm({ initial }: { initial?: Partial<ProjectFormData> & { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    const url = initial?.id ? `/api/admin/projects/${initial.id}` : "/api/admin/projects";
    const method = initial?.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Title">
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="AI Resume Analyzer"
          />
        </Field>
        <Field label="Slug (optional)">
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-generated from title"
          />
        </Field>
      </div>

      <Field label="Short description">
        <input
          className={inputClass}
          value={form.shortDesc}
          onChange={(e) => set("shortDesc", e.target.value)}
          placeholder="One line for the project card"
        />
      </Field>

      <Field label="Full description">
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What it does, how it works, why it matters"
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Image URL">
          <input className={inputClass} value={form.image} onChange={(e) => set("image", e.target.value)} />
        </Field>
        <Field label="Technologies (comma separated)">
          <input
            className={inputClass}
            value={form.technologies}
            onChange={(e) => set("technologies", e.target.value)}
            placeholder="Next.js, TypeScript, PostgreSQL"
          />
        </Field>
        <Field label="GitHub URL">
          <input className={inputClass} value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
        </Field>
        <Field label="Live URL">
          <input className={inputClass} value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} />
        </Field>
      </div>

      <div className="flex items-center gap-6 pt-1">
        <Checkbox label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
        <Checkbox label="Published" checked={form.published} onChange={(v) => set("published", v)} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-white text-black text-sm font-medium px-4 py-2.5 hover:bg-neutral-200 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : initial?.id ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-lg border border-white/15 text-sm px-4 py-2.5 text-neutral-300 hover:bg-white/5 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-neutral-400 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-black/40 accent-emerald-500"
      />
      {label}
    </label>
  );
}
