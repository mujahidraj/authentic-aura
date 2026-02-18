/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Book, Star, X, Quote } from 'lucide-react';
import booksData from '../data/books.json';

// Explicitly map the height classes so Tailwind does not purge them.
const heightClasses: Record<string, string> = {
  "h-64": "h-64",
  "h-60": "h-60",
  "h-56": "h-56",
  "h-52": "h-52",
};

const TheLibrary = () => {
  const [selectedBook, setSelectedBook] = useState<any>(null);

  return (
    <div className="w-full max-w-7xl mx-auto my-32 px-4">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h3 className="text-4xl font-display font-bold text-white mb-3">The Library</h3>
        <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
          Input Source <span className="text-amber-500">•</span> Curated Knowledge
        </p>
      </div>

      {/* Static Shelf Container */}
      <div className="relative w-full">
        
        {/* Books Wrapper: Centered + Scrollable */}
        <div className="flex justify-center w-full overflow-x-auto pt-12 pb-4 scrollbar-hide">
            <div className="flex items-end gap-3 px-4">
            {booksData.map((book) => (
                <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className={`
                    relative flex-shrink-0 w-9 md:w-11 ${heightClasses[book.height] || 'h-64'} 
                    cursor-pointer transition-transform duration-200 hover:-translate-y-4
                    rounded-sm border-l border-white/10 border-r border-black/40 shadow-lg
                `}
                style={{ backgroundColor: book.color }}
                >
                {/* Spine Detail (Texture) */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/30" />

                {/* Spine Content */}
                <div className="relative h-full flex flex-col items-center justify-between py-3">
                    <div className="w-full px-1.5 opacity-60 flex flex-col gap-[2px]">
                        <div className="w-full h-[1px] bg-yellow-100/50" />
                        <div className="w-full h-[1px] bg-yellow-100/50" />
                    </div>

                    <h4 
                    className="flex-1 font-display font-bold text-[9px] md:text-[10px] text-yellow-100/90 uppercase tracking-widest text-center py-4 truncate"
                    style={{ 
                        writingMode: 'vertical-rl', 
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)' 
                    }}
                    >
                    {book.title}
                    </h4>

                    <div className="opacity-80">
                        <Book size={10} className="text-yellow-100/70" />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-4 bg-[#2a2a2a] rounded-sm shadow-xl border-t border-white/10 z-0 w-[95%] max-w-4xl" />
      </div>

      {/* Detail Modal */}
      {selectedBook && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-[#0f0f0f] border border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
             <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 rounded-full text-white hover:bg-white/10"
              >
                <X size={20} />
              </button>

            {/* Left: Color Block with Image */}
            <div 
              className="w-full md:w-2/5 h-64 md:h-auto relative flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: selectedBook.color }}
            >
              {/* Added: Actual Book Image Rendering */}
              {selectedBook.image ? (
                <img 
                  src={selectedBook.image} 
                  alt={selectedBook.title} 
                  className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100"
                />
              ) : (
                <div className="relative z-10 p-6 border-4 border-white/20 rounded-lg shadow-xl">
                  <Book size={48} className="text-white/90" />
                </div>
              )}
              {/* Subtle Overlay Texture */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Right: Content (Kept exactly as is) */}
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
              <div>
                  <div className="mb-6 pr-8">
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                          {selectedBook.title}
                      </h3>
                      <p className="text-gray-400 font-mono text-sm">By {selectedBook.author}</p>
                  </div>

                  <div className="flex gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                          <Star 
                              key={i} 
                              size={18} 
                              className={i < selectedBook.rating ? "text-amber-500 fill-amber-500" : "text-gray-800"} 
                          />
                      ))}
                  </div>

                  <div className="relative pl-6 border-l-2 border-white/10">
                      <Quote className="absolute -top-3 -left-3 text-white/5 w-8 h-8 rotate-180" />
                      <p className="text-gray-300 text-lg italic leading-relaxed">
                          "{selectedBook.review}"
                      </p>
                  </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                  <div className="px-3 py-1.5 bg-white/5 rounded text-xs font-mono text-gray-400 border border-white/5">
                      Status: Read
                  </div>
                  <div className="px-3 py-1.5 bg-amber-500/10 rounded text-xs font-mono text-amber-500 border border-amber-500/20">
                      Recommended
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheLibrary;