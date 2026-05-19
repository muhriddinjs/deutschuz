
import { modules } from '../../config/modules';
import { useStore } from '../../store/useStore';
import { Play, Flame, Trophy } from 'lucide-react';

interface DashboardProps {
  onSelectModule: (moduleId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectModule }) => {
  const { streak, totalCorrect, totalAnswered } = useStore();
  
  const successRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">DeutschUz</h1>
        <p className="text-base text-slate-500">Master German numbers, times, and prices efficiently.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex-1 flex items-center gap-3">
          <div className="bg-orange-100 p-2.5 rounded-lg text-orange-500">
            <Flame size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Current Streak</p>
            <p className="text-xl font-bold text-slate-900">{streak} Days</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex-1 flex items-center gap-3">
          <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-500">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Success Rate</p>
            <p className="text-xl font-bold text-slate-900">{successRate}%</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 px-1">Learning Modules</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onSelectModule(mod.id)}
            className={`group relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200 hover:border-transparent transition-all duration-300 text-left hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${mod.shadowColor}`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 transition-transform group-hover:scale-150 ${mod.color}`} />
            
            <div className="relative z-10 flex items-start gap-3">
              <div className={`p-3 rounded-xl text-white shadow-md ${mod.color}`}>
                <mod.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-0.5">{mod.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">{mod.subtitle}</p>
                <div className="flex items-center text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  Start Practice
                  <Play size={14} className="ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
