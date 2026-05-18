
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">DeutschUz</h1>
        <p className="text-lg text-slate-600">Master German numbers, times, and prices efficiently.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mb-12 justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-500">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Current Streak</p>
            <p className="text-2xl font-bold text-slate-900">{streak} Days</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-500">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Success Rate</p>
            <p className="text-2xl font-bold text-slate-900">{successRate}%</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 px-2">Learning Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onSelectModule(mod.id)}
            className={`group relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-200 hover:border-transparent transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-xl ${mod.shadowColor}`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${mod.color}`} />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className={`p-4 rounded-2xl text-white shadow-lg ${mod.color}`}>
                <mod.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{mod.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{mod.subtitle}</p>
                <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  Start Practice
                  <Play size={16} className="ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
