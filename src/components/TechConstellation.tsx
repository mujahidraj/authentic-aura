/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from 'react';
import { Cloud, fetchSimpleIcons, SimpleIcon, renderSimpleIcon } from 'react-icon-cloud';

// List of slugs from SimpleIcons.org
const slugs = [
  "typescript",
  "javascript",
  "react",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "vercel",
  "netlify",
  "typeorm",
  "postman",
  "insomnia",
  "R",
  "Csharp",
  "mysql",
  "mongodb",
  "supabase",
  
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "figma",
  "python",
  "cplusplus",
  "django"
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
          // Flex container to stack Icon and Text vertically
          className="flex flex-col items-center justify-center text-center cursor-pointer pointer-events-auto"
        >
          {/* Render the Icon */}
          <div className="mb-1"> 
             {renderSimpleIcon({
                icon,
                size: 42,
                aProps: {
                  onClick: (e: any) => e.preventDefault(),
                  style: { border: 'none', display: 'block' } // Ensure no default link styles
                },
                minContrastRatio: 2,
                bgHex: "#000000",
                fallbackHex: "#ffffff",
             })}
          </div>
          
          {/* Render the Label */}
          <span className="text-[10px] font-mono font-bold text-gray-300 bg-black/40 px-1 rounded select-none">
            {icon.title}
          </span>
        </a>
      );
    });
  }, [icons]);

  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      
      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-2xl font-display font-bold text-white">Tech Ecosystem</h3>
        <p className="text-muted-foreground font-mono text-sm">3D Interactive Stack</p>
      </div>

      {/* The Globe */}
      <div className="scale-90 md:scale-110 cursor-pointer">
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
              // Slightly slow down speed so text is readable
              maxSpeed: 0.04, 
              minSpeed: 0.01,
            }}
          >
            {renderedIcons}
          </Cloud>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default TechConstellation;