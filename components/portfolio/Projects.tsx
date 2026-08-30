import { Github, ExternalLink } from "lucide-react";

type Project = {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string;
  featured: number;
};

export default function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">Selected work</p>
      <div className="grid sm:grid-cols-2 gap-5">
        {projects.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-white/[0.06] to-transparent flex items-center justify-center">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-neutral-700 text-xs">No preview image</span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-medium">{p.title}</h3>
                {p.featured ? (
                  <span className="shrink-0 text-[10px] uppercase tracking-wider text-emerald-400 border border-emerald-400/30 rounded-full px-2 py-0.5">
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-neutral-500 mt-1.5">{p.shortDesc || p.description}</p>
              {p.technologies && (
                <p className="text-xs text-neutral-600 mt-3">{p.technologies}</p>
              )}
              <div className="flex items-center gap-4 mt-4">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
                  >
                    <Github size={13} /> GitHub
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
                  >
                    <ExternalLink size={13} /> Live demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
