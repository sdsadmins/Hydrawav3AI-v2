"use client";
import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  title: string;
  id: number;
  subtitle?: string;
  sectionRefs: React.MutableRefObject<(HTMLElement | null)[]>;
}

const Card: React.FC<CardProps> = ({ children, title, id, subtitle, sectionRefs }) => (
  <section
    ref={(el: any) => (sectionRefs.current[id] = el)}
    className="scroll-mt-20 sm:scroll-mt-24 space-y-3 sm:space-y-4 lg:space-y-6 w-full"
  >
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 sm:gap-0">
      <div className="w-full">
        <h2
          className="text-[10px] sm:text-xs font-semibold text-muted-foreground text-gray-600 uppercase tracking-[0.15em] mb-1 sm:mb-2"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {subtitle || `Section 0${id}`}
        </h2>
        <h3
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold antialiased tracking-wide text-[#1a2b33]"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {title}
        </h3>
      </div>
    </div>
    <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 xl:p-12 rounded-xl sm:rounded-2xl lg:rounded-3xl card-shadow border border-[#eeeae5] transition-all duration-300 hover:shadow-xl hover:border-tan-bg/30 hover:-translate-y-0.5 w-full overflow-hidden">
      {children}
    </div>
  </section>
);

export default Card;
