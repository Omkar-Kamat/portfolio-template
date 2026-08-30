import { Sections, Projects, Experiences, Skills, SocialLinks, SettingsStore } from "@/lib/data";
import Nav from "@/components/portfolio/Nav";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import ProjectsSection from "@/components/portfolio/Projects";
import ExperienceSection from "@/components/portfolio/Experience";
import SkillsSection from "@/components/portfolio/Skills";
import ContactSection from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sections = Sections.enabled();
  const settings = SettingsStore.get();
  const projects = Projects.published();
  const experiences = Experiences.all();
  const skills = Skills.all();
  const socialLinks = SocialLinks.all();

  const registry: Record<string, React.ReactNode> = {
    hero: (
      <Hero
        key="hero"
        name={settings.heroName}
        role={settings.heroRole}
        text={settings.heroText}
        resumeUrl={settings.resumeUrl}
      />
    ),
    about: <About key="about" text={settings.aboutText} />,
    projects: <ProjectsSection key="projects" projects={projects} />,
    experience: <ExperienceSection key="experience" items={experiences} />,
    skills: <SkillsSection key="skills" skills={skills} />,
    contact: <ContactSection key="contact" email={settings.contactEmail} links={socialLinks} />,
  };

  return (
    <div className="bg-[#0a0a0c] min-h-screen">
      <Nav siteName={settings.siteName} />
      {sections.map((s) => registry[s.type] ?? null)}
      <Footer name={settings.heroName} />
    </div>
  );
}
