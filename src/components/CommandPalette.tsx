import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { 
  Search, 
  MapPin, 
  Mail, 
  Github, 
  Linkedin, 
  Code, 
  Eye, 
  EyeOff,
  Laptop,
  FileText,
  User,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // If you use routing, otherwise window.location

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  
  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Helper to close and execute
  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setOpen(false)} // Close when clicking backdrop
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Input Field */}
        <div className="flex items-center border-b border-white/10 px-4">
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <Command.Input 
              placeholder="Type a command or search..." 
              className="w-full h-14 bg-transparent outline-none text-white placeholder-gray-500 font-mono text-sm"
            />
            <div className="flex gap-1">
                <span className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">ESC</span>
            </div>
        </div>
        
        {/* List */}
        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="p-4 text-center text-gray-500 font-mono text-sm">
             No results found.
          </Command.Empty>

          {/* Navigation Group */}
          <Command.Group heading="Navigation" className="text-xs text-gray-500 font-mono mb-2 px-2 uppercase tracking-widest">
            <Command.Item 
                onSelect={() => run(() => scrollTo('work'))}
                className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white"
            >
              <Code size={16} /> 
              <span>Projects & Work</span>
            </Command.Item>
            <Command.Item 
                onSelect={() => run(() => scrollTo('research'))}
                className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white"
            >
              <FileText size={16} /> 
              <span>Research & Publications</span>
            </Command.Item>
            <Command.Item 
                onSelect={() => run(() => scrollTo('journey'))}
                className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white"
            >
              <MapPin size={16} /> 
              <span>Journey (Timeline)</span>
            </Command.Item>
            <Command.Item 
                onSelect={() => run(() => scrollTo('pricing'))}
                className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white"
            >
              <User size={16} /> 
              <span>Pricing & Services</span>
            </Command.Item>
          </Command.Group>

      

          {/* Links Group */}
          <Command.Group heading="External" className="text-xs text-gray-500 font-mono mb-2 px-2 mt-4 uppercase tracking-widest">
            <Command.Item 
                onSelect={() => run(() => window.open('https://github.com/mujahidraj', '_blank'))}
                className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white"
            >
              <Github size={16} /> 
              <span>GitHub Profile</span>
              <ExternalLink size={12} className="ml-auto opacity-50" />
            </Command.Item>
            <Command.Item 
                onSelect={() => run(() => window.open('https://linkedin.com', '_blank'))}
                className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white"
            >
              <Linkedin size={16} /> 
              <span>LinkedIn</span>
              <ExternalLink size={12} className="ml-auto opacity-50" />
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="border-t border-white/10 p-2 text-center">
            <p className="text-[10px] text-gray-600 font-mono">
                PRESS <kbd className="bg-white/10 px-1 rounded text-gray-400">↵</kbd> TO SELECT
            </p>
        </div>
      </div>
    </Command.Dialog>
  );
}