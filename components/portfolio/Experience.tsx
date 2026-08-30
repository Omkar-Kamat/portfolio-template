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

export default function ExperienceSection({ items }: { items: Experience[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">Experience</p>
      <div className="space-y-0">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-8 py-6 ${
              i !== items.length - 1 ? "border-b border-white/10" : ""
            }`}
          >
            <p className="text-xs text-neutral-500 pt-1">
              {item.startDate} — {item.endDate}
            </p>
            <div>
              <h3 className="text-white font-medium">
                {item.role} <span className="text-neutral-500 font-normal">· {item.company}</span>
              </h3>
              {item.location && <p className="text-xs text-neutral-600 mt-0.5">{item.location}</p>}
              {item.description && (
                <p className="text-sm text-neutral-400 mt-3 leading-relaxed max-w-2xl">{item.description}</p>
              )}
              {item.technologies && (
                <p className="text-xs text-neutral-600 mt-3">{item.technologies}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
