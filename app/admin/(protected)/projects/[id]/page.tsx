import { notFound } from "next/navigation";
import { Projects } from "@/lib/data";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await Projects.get(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit project</h1>
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          shortDesc: project.shortDesc,
          description: project.description,
          image: project.image,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
          technologies: project.technologies,
          featured: !!project.featured,
          published: !!project.published,
        }}
      />
    </div>
  );
}
