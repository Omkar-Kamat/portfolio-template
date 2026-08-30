"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

type Settings = {
  siteName: string;
  tagline: string;
  heroName: string;
  heroRole: string;
  heroText: string;
  aboutText: string;
  contactEmail: string;
  resumeUrl: string;
  published: number;
};

type SocialLink = { id: string; platform: string; url: string };

const inputClass =
  "w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60 transition";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(setSettings);
    loadLinks();
  }, []);

  function loadLinks() {
    fetch("/api/admin/social-links")
      .then((r) => r.json())
      .then(setLinks);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addLink(e: React.FormEvent) {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;
    await fetch("/api/admin/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, url }),
    });
    setPlatform("");
    setUrl("");
    loadLinks();
  }

  async function removeLink(id: string) {
    await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" });
    loadLinks();
  }

  if (!settings) return <p className="text-neutral-500 text-sm">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Hero copy, about text, contact, and publishing state.</p>
      </div>

      <form onSubmit={save} className="space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-sm font-medium">Portfolio published</p>
            <p className="text-xs text-neutral-500">When off, treat the site as a draft (still viewable here).</p>
          </div>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, published: settings.published ? 0 : 1 })}
            className={`shrink-0 relative w-11 h-6 rounded-full transition ${
              settings.published ? "bg-emerald-500" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                settings.published ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Hero name">
            <input
              className={inputClass}
              value={settings.heroName}
              onChange={(e) => setSettings({ ...settings, heroName: e.target.value })}
            />
          </Field>
          <Field label="Hero role">
            <input
              className={inputClass}
              value={settings.heroRole}
              onChange={(e) => setSettings({ ...settings, heroRole: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Hero tagline">
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            value={settings.heroText}
            onChange={(e) => setSettings({ ...settings, heroText: e.target.value })}
          />
        </Field>

        <Field label="About text">
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={settings.aboutText}
            onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Contact email">
            <input
              className={inputClass}
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </Field>
          <Field label="Resume URL">
            <input
              className={inputClass}
              value={settings.resumeUrl}
              onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-white text-black text-sm font-medium px-4 py-2.5 hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && <span className="text-xs text-emerald-400">Saved</span>}
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-sm font-semibold mb-3">Social links</h2>
        <form onSubmit={addLink} className="flex flex-wrap gap-2 mb-4">
          <input
            className={`${inputClass} flex-1 min-w-32`}
            placeholder="Platform (e.g. GitHub)"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
          <input
            className={`${inputClass} flex-[2] min-w-48`}
            placeholder="https://github.com/you"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black text-sm font-medium px-3.5 py-2 hover:bg-neutral-200 transition"
          >
            <Plus size={16} />
            Add
          </button>
        </form>
        <div className="space-y-2">
          {links.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
            >
              <div className="text-sm">
                <span className="font-medium">{l.platform}</span>{" "}
                <span className="text-neutral-500">{l.url}</span>
              </div>
              <button
                onClick={() => removeLink(l.id)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-neutral-400 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
