import Link from "next/link";
import { Projects } from "@/lib/data";
import ProjectRow from "@/components/admin/ProjectRow";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await Projects.all();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-neutral-500 text-sm mt-1">Full CRUD for your project showcase.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black text-sm font-medium px-3.5 py-2 hover:bg-neutral-200 transition"
        >
          <Plus size={16} />
          Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-neutral-500 text-sm">
          No projects yet. Add your first one.
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
