export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-neutral-600">
          © {new Date().getFullYear()} {name}. Built with Next.js.
        </p>
        <p className="text-xs text-neutral-600">Managed from /admin</p>
      </div>
    </footer>
  );
}
