export default function About({ text }: { text: string }) {
  if (!text) return null;
  return (
    <section id="about" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">About</p>
      <p className="text-xl sm:text-2xl text-neutral-300 leading-relaxed max-w-3xl">{text}</p>
    </section>
  );
}
