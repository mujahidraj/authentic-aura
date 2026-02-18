import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Zap, Headphones, Code2, Globe } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const features = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Scalable Architecture",
    description: "I don't just build for today. I design systems that grow with your user base without breaking a sweat."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Blazing Performance",
    description: "Optimization is in my DNA. I ensure sub-second load times and smooth 60fps interactions."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Security First",
    description: "From data encryption to secure API endpoints, your users' safety is my top priority."
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "Seamless Communication",
    description: "No technical jargon. I provide clear daily updates and maintain a transparent development process."
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Clean, Maintainable Code",
    description: "I write 'Clean Code' that other developers love to work with, ensuring long-term project health."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Mindset",
    description: "Experience working with international clients across multiple time zones and cultures."
  }
];

const WhyChooseMe = () => {
  return (
    <section id="why-me" className="scroll-mt-24 py-24">
      <SectionWrapper className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Why Choose Me<span className="text-primary">?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Combining technical excellence with strategic thinking to turn your vision into a digital masterpiece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </section>
  );
};

export default WhyChooseMe;