import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getProjectBySlug, getAllProjectSlugs, getAllProjects } from '@/lib/mdx';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import ShareButton from '@/app/components/ShareButton';
import ProjectRecommendations from '@/app/components/ProjectRecommendations';
import ReadingProgress from '@/app/components/ReadingProgress';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.frontmatter.title} | Kshitiz Kumar`,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      images: [project.frontmatter.image],
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const { frontmatter, content } = project;
  const allProjects = getAllProjects();
  
  // Convert project to match Project type
  const currentProject = {
    slug: params.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    tags: frontmatter.tags || [],
    image: frontmatter.image,
    repoUrl: frontmatter.repoUrl,
    liveUrl: frontmatter.liveUrl,
    techStack: frontmatter.techStack || [],
    featured: frontmatter.featured,
  };

  return (
    <main className="min-h-screen bg-dark">
      {/* Reading Progress */}
      <ReadingProgress showReadingTime={true} />
      
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark via-dark to-dark-lighter border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="container-custom relative z-10 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-cyan hover:text-cyan-secondary transition-colors mb-6 sm:mb-8 group min-h-[44px] touch-manipulation"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {frontmatter.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 sm:px-3 py-1 bg-cyan/20 text-cyan text-xs sm:text-sm font-semibold rounded-full border border-cyan/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                {frontmatter.title}
              </h1>
              
              <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8">
                {frontmatter.description}
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                {frontmatter.repoUrl && (
                  <a
                    href={frontmatter.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline inline-flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Github size={18} className="sm:w-5 sm:h-5" />
                    View Code
                  </a>
                )}
                {frontmatter.liveUrl && (
                  <a
                    href={frontmatter.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                    Live Demo
                  </a>
                )}
                <ShareButton
                  title={frontmatter.title}
                />
              </div>
            </div>

            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-cyan/20 glow-cyan mt-6 lg:mt-0">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-b border-white/5 bg-dark-lighter">
        <div className="container-custom py-6 sm:py-8">
          <div className="flex items-center gap-2 text-cyan mb-3 sm:mb-4">
            <Tag size={18} className="sm:w-5 sm:h-5" />
            <h2 className="font-semibold text-base sm:text-lg">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {frontmatter.techStack?.map((tech: string) => (
              <span
                key={tech}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-dark border border-white/10 text-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:border-cyan/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <article className="prose prose-invert prose-lg max-w-none">
            <div className="mdx-content">
              <MDXRemote source={content} />
            </div>
          </article>
        </div>
      </section>

      {/* Recommendations */}
      <ProjectRecommendations
        currentProject={currentProject}
        allProjects={allProjects}
      />

      {/* Back to projects */}
      <section className="border-t border-white/5 bg-dark-lighter">
        <div className="container-custom py-8 sm:py-12 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Explore More Projects</h3>
          <Link href="/projects" className="btn-primary inline-flex items-center gap-2">
            View All Projects
          </Link>
        </div>
      </section>
    </main>
  );
}
