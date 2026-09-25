import React, { useState } from 'react';
import { CheckSquare, Square, Clock, AlertCircle, Sparkles, Filter, Download, Copy, Check, Plus, X } from 'lucide-react';
import { DomainAnalysis, RoadmapItem } from '../types';

interface ActionRoadmapProps {
  analysis: DomainAnalysis;
}

export const ActionRoadmap: React.FC<ActionRoadmapProps> = ({ analysis }) => {
  const [items, setItems] = useState<RoadmapItem[]>(analysis.roadmap);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newPhase, setNewPhase] = useState<RoadmapItem['phase']>('Phase 1: 0-30 Days (Quick SEM Wins)');
  const [newCat, setNewCat] = useState<RoadmapItem['category']>('SEM');
  const [newImpact, setNewImpact] = useState<RoadmapItem['impact']>('Critical');

  // Toggle item status
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: RoadmapItem['status'] =
            item.status === 'completed' ? 'pending' : item.status === 'pending' ? 'in_progress' : 'completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: RoadmapItem = {
      id: `task-${Date.now()}`,
      phase: newPhase,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom strategic growth task for domain.',
      category: newCat,
      impact: newImpact,
      effort: 'Medium',
      status: 'pending'
    };

    setItems([newItem, ...items]);
    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  const handleDownloadRoadmapCSV = () => {
    const headers = ['Phase', 'Category', 'Title', 'Description', 'Impact', 'Effort', 'Status'];
    const rows = items.map(i => [
      `"${i.phase}"`,
      `"${i.category}"`,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.description.replace(/"/g, '""')}"`,
      `"${i.impact}"`,
      `"${i.effort}"`,
      `"${i.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Roadmap-${analysis.domain}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredItems = items.filter((item) => {
    const matchesPhase = selectedPhase === 'all' || item.phase.includes(selectedPhase);
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesPhase && matchesCat;
  });

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleCopyRoadmap = () => {
    const text = items
      .map(
        (i) =>
          `[${i.status.toUpperCase()}] ${i.phase}\n• ${i.title} (${i.category} | ${i.impact} Impact | ${i.effort} Effort)\n  ${i.description}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>30-60-90 Day T1 Search Domination Roadmap</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritized agency execution playbook designed to unlock organic rank velocity and scale SEM revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Progress bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 flex items-center gap-3 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400">Playbook:</span>
            <div className="w-20 bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">{progressPercent}%</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-glow active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          <button
            onClick={handleDownloadRoadmapCSV}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Download CSV for project management tools"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleCopyRoadmap}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Tasks!' : 'Export Tasks'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs shadow-sm transition-colors duration-200">
        {/* Phase Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Timeline:</span>
          {['all', '0-30', '30-60', '60-90'].map((phaseKey) => (
            <button
              key={phaseKey}
              onClick={() => setSelectedPhase(phaseKey)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedPhase === phaseKey
                  ? 'bg-brand-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-950/60'
              }`}
            >
              {phaseKey === 'all' ? 'All Phases' : `Phase ${phaseKey} Days`}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Category:</span>
          {['all', 'SEM', 'SEO/T1', 'CRO', 'GEO/AI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-950/60'
              }`}
            >
              {cat === 'all' ? 'All Channels' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
              item.status === 'completed'
                ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/60 opacity-60'
                : item.status === 'in_progress'
                ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-300 dark:border-brand-500/40 shadow-sm dark:shadow-glow'
                : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
            }`}
          >
            {/* Checkbox Icon */}
            <div className="mt-0.5 shrink-0">
              {item.status === 'completed' ? (
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : item.status === 'in_progress' ? (
                <div className="w-5 h-5 rounded-md bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-500">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 flex items-center justify-center" />
              )}
            </div>

            {/* Task Info */}
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  {item.phase.split(':')[0]}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  item.category === 'SEM'
                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20'
                    : item.category === 'SEO/T1'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    : item.category === 'GEO/AI'
                    ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-700 dark:text-accent-400 border border-accent-200 dark:border-accent-500/20'
                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                }`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Impact: <strong className={item.impact === 'Critical' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}>{item.impact}</strong>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Effort: <strong className="text-slate-700 dark:text-slate-300">{item.effort}</strong>
                </span>
              </div>

              <h4 className={`text-sm font-semibold ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                {item.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Status Pill */}
            <div className="shrink-0 hidden sm:block">
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                item.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : item.status === 'in_progress'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Milestone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Domination Milestone
            </h3>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Set up dynamic remarketing audience..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-sans"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specific instructions or KPIs..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Timeline Phase
                  </label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Phase 1: 0-30 Days (Quick SEM Wins)">Phase 1: 0-30 Days</option>
                    <option value="Phase 2: 30-60 Days (Authority Acceleration)">Phase 2: 30-60 Days</option>
                    <option value="Phase 3: 60-90 Days (T1 Market Dominance)">Phase 3: 60-90 Days</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Category Channel
                  </label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="SEM">SEM</option>
                    <option value="SEO/T1">SEO / T1</option>
                    <option value="CRO">CRO</option>
                    <option value="GEO/AI">GEO / AI</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow-glow cursor-pointer active:scale-95"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
