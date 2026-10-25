import React from 'react';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-slate-700">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-900">Career Twin AI</span>
          <span>•</span>
          <span>Vignan Institute of Technology and Science, Deshmukhi</span>
        </div>

        <div className="flex items-center space-x-4 text-slate-500">
          <span>Department of CSM</span>
          <span>•</span>
          <span>Academic Year 2026–2027</span>
          <span>•</span>
          <span className="inline-flex items-center text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Verified Curriculum Standards
          </span>
        </div>
      </div>
    </footer>
  );
};
