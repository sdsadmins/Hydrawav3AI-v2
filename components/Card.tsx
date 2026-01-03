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
  <section ref={(el: any) => (sectionRefs.current[id] = el)} className="scroll-mt-24 space-y-6">
    <div className="flex items-end justify-between px-2">
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground text-gray-600 uppercase tracking-[0.15em] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          {subtitle || `Section 0${id}`}
        </h2>
        <h3 className="text-2xl font-bold antialiased tracking-wide text-[#1a2b33]" style={{ fontFamily: 'var(--font-poppins)' }}>
          {title}
        </h3>
      </div>
    </div>
    <div className="bg-white p-8 md:p-12 rounded-3xl card-shadow border border-[#eeeae5] transition-all duration-300 hover:shadow-xl hover:border-tan-bg/30 hover:-translate-y-0.5">
      {children}
    </div>
  </section>
);

export default Card;

