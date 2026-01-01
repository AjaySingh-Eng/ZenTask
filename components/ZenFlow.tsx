
import React, { useState, useEffect } from 'react';
import { Task, MentalEffort } from '../types';
import { mockBackend } from '../services/mockBackend';

interface ZenFlowProps {
  userId: string;
  onExit: () => void;
}

type FlowStage = 'checkin' | 'selection' | 'focus' | 'break' | 'empty';

const ZenFlow: React.FC<ZenFlowProps> = ({ userId, onExit }) => {
  const [stage, setStage] = useState<FlowStage>('checkin');
  const [energy, setEnergy] = useState<MentalEffort | null>(null);
  const [timeAvailable, setTimeAvailable] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await mockBackend.tasks.getAll(userId);
    if (res.success && res.data) {
      setAllTasks(res.data.filter(t => !t.completed));
    }
  };

  const startFlow = () => {
    if (!energy || !timeAvailable) return;
    
    // Zen Flow Engine Logic
    // 1. Filter by time (don't show 60m tasks if user has 15m)
    // 2. Filter by energy (don't show HIGH effort tasks if user has LOW energy)
    // 3. Sort by priority (here mocked as creation date or logic)
    
    const possibleTasks = allTasks.filter(t => {
      const timeOk = timeAvailable === -1 || t.estimatedMinutes <= timeAvailable;
      const energyOk = 
        energy === MentalEffort.HIGH ? true :
        energy === MentalEffort.MEDIUM ? (t.mentalEffort !== MentalEffort.HIGH) :
        (t.mentalEffort === MentalEffort.LOW);
      
      return timeOk && energyOk;
    });

    if (possibleTasks.length > 0) {
      setActiveTask(possibleTasks[0]);
      setStage('focus');
    } else {
      setStage('empty');
    }
  };

  const completeTask = async () => {
    if (!activeTask) return;
    setIsLoading(true);
    const res = await mockBackend.tasks.update(activeTask.id, { completed: true });
    if (res.success) {
      setAllTasks(prev => prev.filter(t => t.id !== activeTask.id));
      setActiveTask(null);
      setStage('break');
    }
    setIsLoading(false);
  };

  if (stage === 'checkin') {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Zen Check-in</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Let's align your tasks with your current state.</p>
        </div>

        <div className="space-y-10">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 text-center">Your Energy Level</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Low', val: MentalEffort.LOW, icon: '🌤' },
                { label: 'Medium', val: MentalEffort.MEDIUM, icon: '🌥' },
                { label: 'High', val: MentalEffort.HIGH, icon: '☀' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setEnergy(opt.val)}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${energy === opt.val ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform">{opt.icon}</span>
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 text-center">Time Available</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '15m', val: 15 },
                { label: '30m', val: 30 },
                { label: '1h', val: 60 },
                { label: 'Any', val: -1 }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setTimeAvailable(opt.val)}
                  className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${timeAvailable === opt.val ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <button
            onClick={startFlow}
            disabled={!energy || !timeAvailable}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all active:scale-95 mt-8"
          >
            Enter The Flow
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'focus' && activeTask) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="w-full text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4">Focus Mode Active</p>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight max-w-xl mx-auto">
            {activeTask.title}
          </h2>
          {activeTask.description && (
            <p className="text-lg text-slate-400 dark:text-slate-500 mt-6 max-w-md mx-auto leading-relaxed">
              {activeTask.description}
            </p>
          )}
        </div>

        <div className="relative mb-20 group">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={753.98} strokeDashoffset={200} className="text-indigo-600 transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
                <span className="block text-3xl font-black text-slate-900 dark:text-white">{activeTask.estimatedMinutes}m</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Depth</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={completeTask}
            disabled={isLoading}
            className="flex-grow py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.1em] text-lg shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
          >
            {isLoading ? 'Processing...' : 'Task Complete'}
          </button>
          <button 
            onClick={() => setStage('break')}
            className="px-8 py-5 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black uppercase tracking-[0.1em] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          >
            I Need a Break
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'break') {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl">
           🌿
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Beautifully Done</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">Take a moment to breathe. Small wins build giant lives.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => setStage('checkin')}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
          >
            Continue The Flow
          </button>
          <button 
            onClick={onExit}
            className="px-10 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all"
          >
            Return to List
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'empty') {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">
           🕊
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Total Stillness</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 max-w-md mx-auto">No tasks match your current Energy or Time. This is a rare moment of freedom. Enjoy it, or adjust your filters.</p>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setStage('checkin')}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
          >
            Adjust Check-in
          </button>
          <button 
            onClick={onExit}
            className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-all"
          >
            View All Tasks
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ZenFlow;
