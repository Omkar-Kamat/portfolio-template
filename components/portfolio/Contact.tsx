import { Mail, ArrowUpRight } from "lucide-react";

type SocialLink = { id: string; platform: string; url: string };

export default function Contact({ email, links }: { email: string; links: SocialLink[] }) {
  return (
    <section id="contact" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">Contact</p>
      <h2 className="text-2xl sm:text-3xl font-medium text-white max-w-xl leading-snug">
        Have a project in mind, or just want to say hi?
      </h2>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium px-5 py-2.5 hover:bg-neutral-200 transition"
          >
            <Mail size={15} />
            {email}
          </a>
        )}
      </div>

      {links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition"
            >
              {l.platform}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
