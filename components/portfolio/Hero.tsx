"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileDown } from "lucide-react";

export default function Hero({
  name,
  role,
  text,
  resumeUrl,
}: {
  name: string;
  role: string;
  text: string;
  resumeUrl: string;
}) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #10b981, transparent)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6 w-full pt-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-6"
        >
          {role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.05] max-w-3xl"
        >
          Hi, I&apos;m {name}.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed"
        >
          {text}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium px-5 py-2.5 hover:bg-neutral-200 transition"
          >
            View projects
            <ArrowRight size={15} />
          </a>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 text-sm px-5 py-2.5 text-neutral-200 hover:bg-white/5 transition"
            >
              <FileDown size={15} />
              Resume
            </a>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
