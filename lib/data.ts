import { db, genId } from "./db";

export type SectionRow = {
  id: string;
  type: string;
  title: string | null;
  enabled: number;
  order: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string;
  featured: number;
  published: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
  order: number;
};

export type SkillRow = {
  id: string;
  name: string;
  category: string;
  order: number;
};

export type SocialLinkRow = {
  id: string;
  platform: string;
  url: string;
  order: number;
};

export type SettingsRow = {
  id: string;
  siteName: string;
  tagline: string;
  heroName: string;
  heroRole: string;
  heroText: string;
  aboutText: string;
  contactEmail: string;
  resumeUrl: string;
  published: number;
  updatedAt: string;
};

// ---------- Sections ----------
export const Sections = {
  all(): SectionRow[] {
    return db.prepare(`SELECT * FROM sections ORDER BY "order" ASC`).all() as SectionRow[];
  },
  enabled(): SectionRow[] {
    return db
      .prepare(`SELECT * FROM sections WHERE enabled = 1 ORDER BY "order" ASC`)
      .all() as SectionRow[];
  },
  update(id: string, data: Partial<Pick<SectionRow, "enabled" | "order" | "title" | "content">>) {
    const current = db.prepare(`SELECT * FROM sections WHERE id = ?`).get(id) as SectionRow | undefined;
    if (!current) return null;
    const next = { ...current, ...data };
    db.prepare(
      `UPDATE sections SET enabled = ?, "order" = ?, title = ?, content = ?, updatedAt = datetime('now') WHERE id = ?`
    ).run(next.enabled ? 1 : 0, next.order, next.title, next.content, id);
    return db.prepare(`SELECT * FROM sections WHERE id = ?`).get(id) as SectionRow;
  },
  reorder(order: string[]) {
    const stmt = db.prepare(`UPDATE sections SET "order" = ? WHERE id = ?`);
    db.exec("BEGIN");
    try {
      order.forEach((id, idx) => stmt.run(idx + 1, id));
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  },
};

// ---------- Projects ----------
export const Projects = {
  all(): ProjectRow[] {
    return db.prepare(`SELECT * FROM projects ORDER BY "order" ASC, createdAt DESC`).all() as ProjectRow[];
  },
  published(): ProjectRow[] {
    return db
      .prepare(`SELECT * FROM projects WHERE published = 1 ORDER BY "order" ASC, createdAt DESC`)
      .all() as ProjectRow[];
  },
  get(id: string): ProjectRow | undefined {
    return db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id) as ProjectRow | undefined;
  },
  create(data: Omit<ProjectRow, "id" | "createdAt" | "updatedAt">) {
    const id = genId("proj");
    db.prepare(
      `INSERT INTO projects (id, title, slug, description, shortDesc, image, githubUrl, liveUrl, technologies, featured, published, "order")
       VALUES (@id, @title, @slug, @description, @shortDesc, @image, @githubUrl, @liveUrl, @technologies, @featured, @published, @order)`
    ).run({ id, ...data });
    return this.get(id);
  },
  update(id: string, data: Partial<Omit<ProjectRow, "id" | "createdAt" | "updatedAt">>) {
    const current = this.get(id);
    if (!current) return null;
    const next = { ...current, ...data };
    db.prepare(
      `UPDATE projects SET title=@title, slug=@slug, description=@description, shortDesc=@shortDesc,
       image=@image, githubUrl=@githubUrl, liveUrl=@liveUrl, technologies=@technologies,
       featured=@featured, published=@published, "order"=@order, updatedAt=datetime('now')
       WHERE id=@id`
    ).run({ ...next, id });
    return this.get(id);
  },
  remove(id: string) {
    db.prepare(`DELETE FROM projects WHERE id = ?`).run(id);
  },
};

// ---------- Experiences ----------
export const Experiences = {
  all(): ExperienceRow[] {
    return db.prepare(`SELECT * FROM experiences ORDER BY "order" ASC`).all() as ExperienceRow[];
  },
  get(id: string): ExperienceRow | undefined {
    return db.prepare(`SELECT * FROM experiences WHERE id = ?`).get(id) as ExperienceRow | undefined;
  },
  create(data: Omit<ExperienceRow, "id">) {
    const id = genId("exp");
    db.prepare(
      `INSERT INTO experiences (id, company, role, location, startDate, endDate, description, technologies, "order")
       VALUES (@id, @company, @role, @location, @startDate, @endDate, @description, @technologies, @order)`
    ).run({ id, ...data });
    return this.get(id);
  },
  update(id: string, data: Partial<Omit<ExperienceRow, "id">>) {
    const current = this.get(id);
    if (!current) return null;
    const next = { ...current, ...data };
    db.prepare(
      `UPDATE experiences SET company=@company, role=@role, location=@location, startDate=@startDate,
       endDate=@endDate, description=@description, technologies=@technologies, "order"=@order,
       updatedAt=datetime('now') WHERE id=@id`
    ).run({ ...next, id });
    return this.get(id);
  },
  remove(id: string) {
    db.prepare(`DELETE FROM experiences WHERE id = ?`).run(id);
  },
};

// ---------- Skills ----------
export const Skills = {
  all(): SkillRow[] {
    return db.prepare(`SELECT * FROM skills ORDER BY category ASC, "order" ASC`).all() as SkillRow[];
  },
  create(data: Omit<SkillRow, "id">) {
    const id = genId("skill");
    db.prepare(`INSERT INTO skills (id, name, category, "order") VALUES (@id, @name, @category, @order)`).run({
      id,
      ...data,
    });
    return id;
  },
  remove(id: string) {
    db.prepare(`DELETE FROM skills WHERE id = ?`).run(id);
  },
};

// ---------- Social Links ----------
export const SocialLinks = {
  all(): SocialLinkRow[] {
    return db.prepare(`SELECT * FROM social_links ORDER BY "order" ASC`).all() as SocialLinkRow[];
  },
  create(data: Omit<SocialLinkRow, "id">) {
    const id = genId("soc");
    db.prepare(`INSERT INTO social_links (id, platform, url, "order") VALUES (@id, @platform, @url, @order)`).run({
      id,
      ...data,
    });
    return id;
  },
  remove(id: string) {
    db.prepare(`DELETE FROM social_links WHERE id = ?`).run(id);
  },
};

// ---------- Settings ----------
export const SettingsStore = {
  get(): SettingsRow {
    return db.prepare(`SELECT * FROM settings WHERE id = 'singleton'`).get() as SettingsRow;
  },
  update(data: Partial<Omit<SettingsRow, "id" | "updatedAt">>) {
    const current = this.get();
    const next = { ...current, ...data };
    db.prepare(
      `UPDATE settings SET siteName=@siteName, tagline=@tagline, heroName=@heroName, heroRole=@heroRole,
       heroText=@heroText, aboutText=@aboutText, contactEmail=@contactEmail, resumeUrl=@resumeUrl,
       published=@published, updatedAt=datetime('now') WHERE id='singleton'`
    ).run(next);
    return this.get();
  },
};
