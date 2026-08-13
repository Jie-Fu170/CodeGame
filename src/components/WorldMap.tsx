import React, { useMemo } from 'react';
import { LEVELS, GameLevel } from '../config/levels';
import { useGameStore } from '../store/useGameStore';
import { getLevelTheme } from '../config/theme';
import { Map, MapPin, CheckCircle2, Play, Compass, Database, Cpu, HardDrive, Network, Layers, Shield, FileCode, Check } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  '计算机组成原理': <Cpu size={24} />,
  '操作系统': <HardDrive size={24} />,
  '计算机网络': <Network size={24} />,
  '数据库': <Database size={24} />,
  '数据结构与算法': <Layers size={24} />,
  '设计模式': <FileCode size={24} />,
  '信息安全': <Shield size={24} />,
  '系统架构': <MapPin size={24} />,
  '软件工程': <Compass size={24} />
};

export function WorldMap() {
  const { setLevel, completedLevels, completeLevel } = useGameStore();

  const groups = useMemo(() => {
    const res: Array<{ category: string; levels: GameLevel[] }> = [];
    LEVELS.forEach(level => {
      const group = res.find(g => g.category === level.category);
      if (group) group.levels.push(level);
      else res.push({ category: level.category, levels: [level] });
    });
    return res;
  }, []);

  const totalCompleted = completedLevels.length;
  const progressPercent = Math.round((totalCompleted / LEVELS.length) * 100);

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 overflow-hidden text-slate-200">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md shadow-2xl gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Map size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-wider">
              CODE CONTINENT
            </h1>
            <p className="text-slate-400 text-sm tracking-widest uppercase">软考核心考点知识图谱</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Total Progress</div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="font-mono font-bold text-lg text-white">{progressPercent}%</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{totalCompleted} / {LEVELS.length} 关卡已征服</div>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y nav-scroll p-4 sm:p-8 md:p-12" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-[1400px] mx-auto flex flex-col gap-12 pb-24">
          {groups.map((group, groupIdx) => {
            const groupCompleted = group.levels.filter(l => completedLevels.includes(l.id)).length;
            const isAllCompleted = groupCompleted === group.levels.length;

            return (
              <div key={group.category} className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                
                {/* Continent Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl shadow-lg border flex-shrink-0 transition-colors ${
                    isAllCompleted 
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}>
                    {CATEGORY_ICONS[group.category] || <MapPin size={24} />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white tracking-wide">{group.category}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                      <span className="font-mono text-sm text-slate-500">
                        <span className={groupCompleted > 0 ? "text-indigo-400 font-bold" : ""}>{groupCompleted}</span> / {group.levels.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
                  {group.levels.map((level, idx) => {
                    const isCompleted = completedLevels.includes(level.id);
                    const theme = getLevelTheme(level.themeColor);
                    
                    return (
                      <div 
                        key={level.id}
                        className={`group relative rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
                          isCompleted 
                            ? 'bg-slate-800/40 border-slate-700 shadow-md hover:border-slate-500' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80'
                        }`}
                      >
                        {/* Status Indicator */}
                        <div className="absolute top-3 right-3 z-10">
                          {isCompleted ? (
                            <CheckCircle2 size={20} className="text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-700 group-hover:border-slate-500 transition-colors"></div>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${theme.bgSolid}`}></span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                              Lvl {String(idx + 1).padStart(2, '0')}
                            </span>
                            {level.isNew && (
                              <span className="ml-auto mr-6 font-mono text-[9px] px-1.5 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                                NEW
                              </span>
                            )}
                          </div>
                          <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${isCompleted ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                            {level.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
                            {level.description}
                          </p>
                        </div>
                        
                        {/* Action Bar */}
                        <div className="px-5 py-3 bg-black/40 border-t border-slate-800/50 flex items-center justify-between group-hover:bg-slate-800 transition-colors">
                          <span className={`font-mono text-[10px] px-2 py-1 rounded bg-slate-900 border border-slate-700 ${theme.text}`}>
                            {level.engine === 'react' ? 'React' : 'Phaser'}
                          </span>
                          
                          <div className="flex gap-2">
                            {/* Hidden debug button to easily mark as done */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); completeLevel(level.id); }}
                              className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              title="Mark as completed (Debug)"
                            >
                              <Check size={14} />
                            </button>

                            <button 
                              onClick={() => setLevel(level.id)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
                                isCompleted 
                                  ? 'bg-slate-700 text-slate-300 hover:bg-white hover:text-black' 
                                  : `bg-slate-800 ${theme.text} hover:${theme.bgSolid} hover:text-white border border-slate-700`
                              }`}
                            >
                              <Play size={12} className="ml-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
