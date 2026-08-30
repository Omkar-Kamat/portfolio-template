type Skill = { id: string; name: string; category: string };

export default function Skills({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">Skills</p>
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-sm text-neutral-500 mb-2.5">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <span
                    key={s.id}
                    className="text-sm text-neutral-300 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1"
                  >
                    {s.name}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
