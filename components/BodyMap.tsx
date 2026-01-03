"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D BodyMap to avoid SSR issues
const BodyMap3D = dynamic(() => import('./BodyMap3D'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#fdfbf9] rounded-3xl border border-[#eeeae5] min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-tan-bg border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm font-medium text-[#8b8780]" style={{ fontFamily: 'var(--font-poppins)' }}>
          Loading 3D Model...
        </p>
      </div>
    </div>
  )
});

interface BodyMapProps {
  selectedAreas: string[];
  onSelect: (area: string) => void;
  multiple?: boolean;
}

const BodyMap: React.FC<BodyMapProps> = ({ selectedAreas, onSelect, multiple = false }) => {
  return (
    <Suspense fallback={
      <div className="bg-[#fdfbf9] rounded-3xl border border-[#eeeae5] min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-tan-bg border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm font-medium text-[#8b8780]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Loading 3D Model...
          </p>
        </div>
      </div>
    }>
      <BodyMap3D selectedAreas={selectedAreas} onSelect={onSelect} />
    </Suspense>
  );
};

export default BodyMap;

