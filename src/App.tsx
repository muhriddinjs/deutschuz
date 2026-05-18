import { useState } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { GameController } from './components/Quiz/GameController';

function App() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="text-2xl font-black tracking-tighter text-blue-600 cursor-pointer flex items-center gap-2"
            onClick={() => setActiveModule(null)}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">D</div>
            DeutschUz
          </div>
        </div>
      </header>

      <main className="py-8">
        {activeModule ? (
          <GameController 
            moduleId={activeModule} 
            onExit={() => setActiveModule(null)} 
          />
        ) : (
          <Dashboard onSelectModule={setActiveModule} />
        )}
      </main>
    </div>
  );
}

export default App;
