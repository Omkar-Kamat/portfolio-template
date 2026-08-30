"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star, Trash2 } from "lucide-react";

type Project = {
  id: string;
  title: string;
  shortDesc: string;
  technologies: string;
  featured: number;
  published: number;
};

export default function ProjectRow({ project }: { project: Project }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePublished() {
    setBusy(true);
    await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !project.published }),
    });
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    setBusy(true);
    await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 bg-white/[0.02]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${project.id}`} className="text-sm font-medium hover:underline truncate">
            {project.title}
          </Link>
          {project.featured ? <Star size={12} className="text-yellow-400 shrink-0" fill="currentColor" /> : null}
        </div>
        <p className="text-xs text-neutral-500 truncate">
          {project.technologies || project.shortDesc || "No description yet"}
        </p>
      </div>
      <button
        onClick={togglePublished}
        disabled={busy}
        className={`shrink-0 text-xs px-2.5 py-1 rounded-full border transition ${
          project.published
            ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
            : "border-white/15 text-neutral-400"
        }`}
      >
        {project.published ? "Published" : "Draft"}
      </button>
      <Link
        href={`/admin/projects/${project.id}`}
        className="shrink-0 text-xs px-2.5 py-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
      >
        Edit
      </Link>
      <button
        onClick={remove}
        disabled={busy}
        className="shrink-0 p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
