
import React, { useState, useEffect, useMemo } from 'react';
import { Task, MentalEffort } from '../types';
import { mockBackend } from '../services/mockBackend';
import ConfirmationModal from './ConfirmationModal';

interface TaskListProps { userId: string; }

type SortField = 'title' | 'createdAt' | 'completed';
type SortOrder = 'asc' | 'desc';

const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEffort, setNewEffort] = useState<MentalEffort>(MentalEffort.MEDIUM);
  const [newMinutes, setNewMinutes] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    const res = await mockBackend.tasks.getAll(userId);
    if (res.success && res.data) {
      setTasks(res.data);
    }
    setIsLoading(false);
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'completed') {
        comparison = Number(a.completed) - Number(b.completed);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortField, sortOrder]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const res = await mockBackend.tasks.create(userId, newTitle, newDesc, newEffort, newMinutes);
    if (res.success && res.data) {
      setTasks([res.data, ...tasks]);
      setNewTitle('');
      setNewDesc('');
      setNewEffort(MentalEffort.MEDIUM);
      setNewMinutes(30);
      setIsAdding(false);
    }
  };

  const toggleTask = async (taskId: string, current: boolean) => {
    const res = await mockBackend.tasks.update(taskId, { completed: !current });
    if (res.success) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !current } : t));
    }
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    const res = await mockBackend.tasks.delete(taskToDelete);
    if (res.success) {
      setTasks(prev => prev.filter(t => t.id !== taskToDelete));
    }
    setTaskToDelete(null);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="text-slate-500 dark:text-slate-400 text-sm">Syncing Zen Workspace...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Filter</label>
            <select 
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer"
            >
              <option value="createdAt">Date Created</option>
              <option value="title">Alphabetical</option>
              <option value="completed">Status</option>
            </select>
          </div>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg active:scale-95"
          >
            {isAdding ? 'Close Panel' : 'Add New Task'}
          </button>
        </div>
        
        {isAdding && (
          <div className="p-6 bg-indigo-50/30 dark:bg-indigo-900/10 border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleAddTask} className="space-y-4 max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-800 dark:text-white font-medium"
                required
              />
              <textarea 
                placeholder="Optional description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-800 dark:text-white min-h-[80px] resize-none"
              />
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-grow space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-widest ml-1">Mental Effort</label>
                  <div className="flex gap-2">
                    {[MentalEffort.LOW, MentalEffort.MEDIUM, MentalEffort.HIGH].map(eff => (
                      <button
                        key={eff}
                        type="button"
                        onClick={() => setNewEffort(eff)}
                        className={`flex-grow py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 transition-all ${newEffort === eff ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300'}`}
                      >
                        {eff}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full sm:w-32 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-widest ml-1">Minutes</label>
                  <input 
                    type="number"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none bg-white dark:bg-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]">
                Add to Workspace
              </button>
            </form>
          </div>
        )}

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sortedTasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            return (
              <div key={task.id} className={`flex flex-col transition-all group ${task.completed ? 'bg-slate-50/50 dark:bg-slate-950/20' : 'bg-white dark:bg-slate-900'} hover:bg-slate-50/80 dark:hover:bg-slate-800/40`}>
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center space-x-4 flex-grow min-w-0">
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id, task.completed);
                        }}
                        className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-indigo-600 cursor-pointer transition-all active:scale-75 hover:scale-110 z-10 bg-white dark:bg-slate-800"
                      />
                      {task.completed && (
                         <div className="absolute inset-0 pointer-events-none animate-ping rounded-lg bg-indigo-400 opacity-20 scale-150 duration-1000"></div>
                      )}
                    </div>
                    
                    <div className="flex-grow cursor-pointer min-w-0 py-1" onClick={() => toggleExpand(task.id)}>
                      <div className="relative inline-flex items-center max-w-full">
                        <h4 className={`text-base font-bold transition-all duration-500 truncate pr-2 ${task.completed ? 'text-slate-300 dark:text-slate-600 italic' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                        </h4>
                        {/* Animated strikethrough */}
                        <div 
                          className={`absolute top-1/2 left-0 h-[2px] bg-indigo-400/50 dark:bg-indigo-900/50 transition-all duration-500 ease-in-out ${
                            task.completed ? 'w-full opacity-100' : 'w-0 opacity-0'
                          }`}
                          style={{ transform: 'translateY(-50%)' }}
                        />
                      </div>
                      <div className="flex gap-3 mt-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${task.completed ? 'text-slate-200 dark:text-slate-800' : 'text-indigo-400 dark:text-indigo-600'}`}>{task.mentalEffort} Effort</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${task.completed ? 'text-slate-200 dark:text-slate-800' : 'text-slate-300 dark:text-slate-700'}`}>{task.estimatedMinutes}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setTaskToDelete(task.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
                    </button>
                    
                    {task.description && (
                      <button 
                        onClick={() => toggleExpand(task.id)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${isExpanded ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}
                      >
                         <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    )}
                  </div>
                </div>
                {isExpanded && task.description && (
                  <div className="px-14 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                    <div className="border-l-4 border-slate-100 dark:border-slate-800 pl-4 py-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-r-xl">
                      <p className={`text-sm leading-relaxed transition-all ${task.completed ? 'text-slate-300 dark:text-slate-600 italic' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>{task.description}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {sortedTasks.length === 0 && !isAdding && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200 dark:border-slate-700">
                <svg className="w-8 h-8 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">No active tasks</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={taskToDelete !== null}
        title="Delete Task"
        message="This will permanently remove this record from your workspace. This action is irreversible."
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
        confirmText="Remove Forever"
      />
    </div>
  );
};

export default TaskList;
