/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from 'react';
import { Cloud, fetchSimpleIcons, SimpleIcon, renderSimpleIcon } from 'react-icon-cloud';
import { Sparkles } from 'lucide-react';

// List of slugs from SimpleIcons.org (includes No-Code AI Automation & LLM ecosystem)
const slugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "vite",
  "tailwindcss",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nestjs",
  "prisma",
  "postgresql",
  "supabase",
  "firebase",
  "mongodb",
  "mysql",
  "kotlin",
  "python",
  "r",
  "git",
  "github",
  "gitlab",
  "vercel",
  "netlify",
  "postman",
  "figma",
  "androidstudio",
  // No-Code AI Automation & LLMs
  "n8n",
  "zapier",
  "make",
  "openai",
  "claude",
  "anthropic",
  "googlegemini",
  "perplexity",
  "notion",
  "airtable",
  "ifttt"
];

const NO_CODE_AI_TOOLS = [
  "n8n",
  "Zapier",
  "Make.com",
  "ChatGPT / OpenAI",
  "Claude",
  "Google Gemini",
  "Notion Automations",
  "Airtable Workflows",
  "IFTTT"
];

const TechConstellation = () => {
  const [icons, setIcons] = useState<SimpleIcon[] | null>(null);

  useEffect(() => {
    fetchSimpleIcons({ slugs }).then(({ simpleIcons }) => {
      setIcons(Object.values(simpleIcons));
    });
  }, []);

  const renderedIcons = useMemo(() => {
    if (!icons) return null;

    return icons.map((icon) => {
      return (
        <a
          key={icon.slug}
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center text-center cursor-pointer pointer-events-auto"
        >
          <div className="mb-1">
            {renderSimpleIcon({
              icon,
              size: 42,
              aProps: {
                onClick: (e: any) => e.preventDefault(),
                style: { border: 'none', display: 'block' }
              },
              minContrastRatio: 2,
              bgHex: "#000000",
              fallbackHex: "#ffffff",
            })}
          </div>

          <span className="text-[10px] font-mono font-bold text-gray-300 bg-black/40 px-1 rounded select-none">
            {icon.title}
          </span>
        </a>
      );
    });
  }, [icons]);

  return (
    <div className="w-full min-h-[640px] relative overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center pb-16 pt-12">

      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-2xl font-display font-bold text-white">Tech Ecosystem</h3>
        <p className="text-muted-foreground font-mono text-sm">3D Interactive Stack • Full-Stack &amp; No-Code AI Automation</p>
      </div>

      {/* The Globe */}
      <div className="scale-90 md:scale-105 cursor-pointer">
        {renderedIcons ? (
          <Cloud
            options={{
              clickToFront: 500,
              depth: 1,
              imageScale: 2,
              initial: [0.1, -0.1],
              outlineColour: '#0000',
              reverse: true,
              tooltip: 'native',
              tooltipDelay: 0,
              wheelZoom: false,
              maxSpeed: 0.04,
              minSpeed: 0.01,
            }}
          >
            {renderedIcons}
          </Cloud>
        ) : (
          <div className="flex items-center justify-center h-[420px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* No-Code AI Automation Strip */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary font-mono text-[11px] uppercase tracking-wider mb-3">
          <Sparkles size={12} /> Exploring No-Code AI Automation &amp; LLMs
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {NO_CODE_AI_TOOLS.map(tool => (
            <span
              key={tool}
              className="px-2.5 py-1 rounded-lg font-mono text-xs bg-white/5 border border-white/10 text-gray-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TechConstellation;
