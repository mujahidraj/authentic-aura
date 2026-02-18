import projectsData from '../data/projects.json';
import demoProjectsData from '../data/demo_projects.json';
import dataScienceWorksData from '../data/data_science_works.json';
import wordpressWorksData from '../data/wordpress_works.json';
import worksData from '../data/works.json';
import educationData from '../data/education.json';
import experiencesData from '../data/experiences.json';
import publicationsData from '../data/publications.json';
import pricingData from '../data/pricing.json';

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  story?: string;
  tags: string[];
  type: string;
  status?: string;
  year?: string;
  images?: string[];
  links?: {
    demo: string | null;
    github: string | null;
    paper: string | null;
  };
  featured?: boolean;
  size?: 'small' | 'medium' | 'large';
  notebookType?: string;
  codeSnippet?: string;
  metrics?: Record<string, string>;
}

export interface WorkItem {
  id: string;
  company: string;
  role: string;
  location: string;
  coordinates: { lat: number; lng: number };
  period: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  tags: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  major: string;
  institution: string;
  location: string;
  coordinates: { lat: number; lng: number };
  period: string;
  startDate: string;
  endDate: string | null;
  gpa: string | null;
  description: string;
  achievements: string[];
  tags: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  coordinates: { lat: number; lng: number };
  period: string;
  startDate: string;
  endDate: string | null;
  type: string;
  description: string;
  achievements: string[];
  tags: string[];
}

export interface PublicationItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  story: string;
  tags: string[];
  type: string;
  year: string;
  venue: string;
  authors: string[];
  images: string[];
  links: { paper: string | null; github: string | null; demo: string | null };
  citations: number | null;
  featured: boolean;
}

export interface PricingData {
  headline: string;
  currency: string;
  note: string;
  categories: {
    id: string;
    type: string;
    description: string;
    rateHourly: number;
    rateProject: string;
    timeline: string;
    deliverables: string[];
    tags: string[];
  }[];
}

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  coordinates: { lat: number; lng: number };
  period: string;
  type: 'education' | 'work' | 'experience';
  description: string;
  achievements: string[];
  tags: string[];
}

export function usePortfolioData() {
  const projects = projectsData as PortfolioItem[];
  const demoProjects = demoProjectsData as PortfolioItem[];
  const dataScienceWorks = dataScienceWorksData as PortfolioItem[];
  const wordpressWorks = wordpressWorksData as PortfolioItem[];
  const works = worksData as WorkItem[];
  const education = educationData as EducationItem[];
  const experiences = experiencesData as ExperienceItem[];
  const publications = publicationsData as PublicationItem[];
  const pricing = pricingData as PricingData;

  // All portfolio grid items combined
  const allPortfolioItems: PortfolioItem[] = [
    ...projects,
    ...demoProjects,
    ...dataScienceWorks,
    ...wordpressWorks,
    ...(publications.map(p => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      story: p.story,
      tags: p.tags,
      type: 'publication',
      year: p.year,
      images: p.images,
      links: p.links,
      featured: p.featured,
      size: 'medium' as const,
    }))),
  ];

  // Extract all unique tags
  const allTags = extractAllTags(allPortfolioItems);

  // Timeline: merge education + work + experiences sorted by date
  const timeline: TimelineItem[] = [
    ...education.map(e => ({
      id: e.id,
      title: e.degree,
      organization: e.institution,
      location: e.location,
      coordinates: e.coordinates,
      period: e.period,
      type: 'education' as const,
      description: e.description,
      achievements: e.achievements,
      tags: e.tags,
    })),
    ...works.map(w => ({
      id: w.id,
      title: w.role,
      organization: w.company,
      location: w.location,
      coordinates: w.coordinates,
      period: w.period,
      type: 'work' as const,
      description: w.description,
      achievements: w.achievements,
      tags: w.tags,
    })),
    ...experiences.map(e => ({
      id: e.id,
      title: e.title,
      organization: e.organization,
      location: e.location,
      coordinates: e.coordinates,
      period: e.period,
      type: 'experience' as const,
      description: e.description,
      achievements: e.achievements,
      tags: e.tags,
    })),
  ].sort((a, b) => b.period.localeCompare(a.period));

  function filterByTag(tag: string): PortfolioItem[] {
    if (!tag || tag === 'All') return allPortfolioItems;
    return allPortfolioItems.filter(item =>
      item.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  return {
    projects,
    demoProjects,
    dataScienceWorks,
    wordpressWorks,
    works,
    education,
    experiences,
    publications,
    pricing,
    allPortfolioItems,
    allTags,
    timeline,
    filterByTag,
  };
}

export function extractAllTags(items: PortfolioItem[]): string[] {
  const tagSet = new Set<string>();
  items.forEach(item => item.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
