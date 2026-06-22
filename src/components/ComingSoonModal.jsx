import React from 'react';

export default function ComingSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const features = [
    {
      id: 1,
      title: 'AI Video Generation',
      description: 'Generate educational videos automatically from lesson plans. Acadium AI will create teacher-ready animated lesson videos.',
      icon: '📹',
      color: 'bg-purple-100 text-purple-600',
      border: 'border-purple-200'
    },
    {
      id: 2,
      title: '3D Geography Visualizer',
      description: 'Generate interactive 3D maps, oceans, mountains, rivers and geography scenes for better learning experience.',
      examples: ['Oceans', 'Continents', 'Mountains', 'Earth Layers', 'Climate Zones'],
      icon: '🌍',
      color: 'bg-blue-100 text-blue-600',
      border: 'border-blue-200'
    },
    {
      id: 3,
      title: '3D Science Laboratory',
      description: 'Generate interactive 3D models for Physics, Chemistry and Biology lessons.',
      examples: ['Human body', 'Solar system', 'Cells', 'Molecules', 'Physics experiments'],
      icon: '🧬',
      color: 'bg-emerald-100 text-emerald-600',
      border: 'border-emerald-200'
    },
    {
      id: 4,
      title: 'AI Voice Teacher',
      description: 'Generate realistic teacher voice narration for every lesson.',
      icon: '🎙',
      color: 'bg-orange-100 text-orange-600',
      border: 'border-orange-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-all" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl shadow-inner">
              ✨
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Future AI Features</h2>
              <p className="text-xs text-slate-500 font-medium">Currently under development for future updates.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-colors outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 space-y-4 bg-slate-50/50">
          {features.map(feature => (
            <div key={feature.id} className={`bg-white rounded-2xl p-4 sm:p-5 border ${feature.border} shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start justify-between sm:justify-start w-full sm:w-auto">
                  <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="sm:hidden">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider border border-indigo-100">
                      Coming Soon
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>
                    <div className="hidden sm:block">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider border border-indigo-100">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  
                  {feature.examples && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {feature.examples.map((example, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                          {example}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white text-center">
          <p className="text-xs text-slate-400 font-medium">
            These features are currently under development and will be released in future updates.
          </p>
        </div>
      </div>
    </div>
  );
}
