import Link from "next/link";
import { Sections, Projects, Experiences, Skills, SettingsStore } from "@/lib/data";

export default async function DashboardPage() {
  const sections = await Sections.all();
  const projects = await Projects.all();
  const experiences = await Experiences.all();
  const skills = await Skills.all();
  const settings = await SettingsStore.get();

  const stats = [
    { label: "Sections active", value: sections.filter((s) => s.enabled).length, total: sections.length },
    { label: "Projects", value: projects.length },
    { label: "Experience entries", value: experiences.length },
    { label: "Skills", value: skills.length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="text-neutral-500 text-sm mt-1">A snapshot of your portfolio.</p>
        </div>
        <span
          className={`text-xs px-3 py-1.5 rounded-full border ${
            settings.published
              ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
              : "border-yellow-400/30 text-yellow-400 bg-yellow-400/10"
          }`}
        >
          ● {settings.published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-2xl font-semibold">
              {s.value}
              {s.total !== undefined && <span className="text-neutral-500 text-base"> / {s.total}</span>}
            </p>
            <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/sections"
          className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition group"
        >
          <p className="text-sm font-medium mb-1 group-hover:text-emerald-400 transition">Manage sections</p>
          <p className="text-xs text-neutral-500">Toggle, reorder, and rename the sections shown on your portfolio.</p>
        </Link>
        <Link
          href="/admin/projects"
          className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition group"
        >
          <p className="text-sm font-medium mb-1 group-hover:text-emerald-400 transition">Manage projects</p>
          <p className="text-xs text-neutral-500">Add, edit, publish, and feature your projects.</p>
        </Link>
        <Link
          href="/admin/experience"
          className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition group"
        >
          <p className="text-sm font-medium mb-1 group-hover:text-emerald-400 transition">Manage experience</p>
          <p className="text-xs text-neutral-500">Keep your work history current.</p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition group"
        >
          <p className="text-sm font-medium mb-1 group-hover:text-emerald-400 transition">Site settings</p>
          <p className="text-xs text-neutral-500">Hero copy, about text, contact, and resume link.</p>
        </Link>
      </div>
    </div>
  );
}
