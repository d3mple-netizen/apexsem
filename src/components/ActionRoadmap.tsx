import React, { useState } from 'react';
import { Clock, Download, Copy, Check, Plus, X } from 'lucide-react';
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
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-fg">
            30-60-90 Day T1 Search Domination Roadmap
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Prioritized agency execution playbook designed to unlock organic rank velocity and scale SEM revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Progress bar */}
          <div className="flex items-center gap-3 px-3 py-1">
            <span className="text-xs text-fg-muted">Playbook</span>
            <div className="w-20 bg-surface-2 h-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs num font-semibold text-fg">{progressPercent}%</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          <button
            onClick={handleDownloadRoadmapCSV}
            className="btn btn-secondary btn-sm"
            title="Download CSV for project management tools"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleCopyRoadmap}
            className="btn btn-secondary btn-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-fg-subtle" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Tasks!' : 'Export Tasks'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card flex flex-wrap items-center justify-between gap-4 p-4 text-xs">
        {/* Phase Filter */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-fg-subtle mr-2">Timeline</span>
          {['all', '0-30', '30-60', '60-90'].map((phaseKey) => (
            <button
              key={phaseKey}
              onClick={() => setSelectedPhase(phaseKey)}
              className={`px-3 py-1 rounded-sm transition-colors cursor-pointer ${
                selectedPhase === phaseKey
                  ? 'bg-surface-2 text-fg font-semibold'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-2'
              }`}
            >
              {phaseKey === 'all' ? 'All Phases' : `Phase ${phaseKey} Days`}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-fg-subtle mr-2">Category</span>
          {['all', 'SEM', 'SEO/T1', 'CRO', 'GEO/AI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-sm transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-surface-2 text-fg font-semibold'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-2'
              }`}
            >
              {cat === 'all' ? 'All Channels' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="card divide-y divide-line overflow-hidden">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-5 transition-colors cursor-pointer flex items-start gap-4 ${
              item.status === 'completed'
                ? 'opacity-60 hover:bg-surface-2'
                : item.status === 'in_progress'
                ? 'bg-accent-soft'
                : 'hover:bg-surface-2'
            }`}
          >
            {/* Checkbox Icon */}
            <div className="mt-0.5 shrink-0">
              {item.status === 'completed' ? (
                <div className="w-4 h-4 rounded-sm bg-fg-muted flex items-center justify-center text-surface">
                  <Check className="w-3 h-3" />
                </div>
              ) : item.status === 'in_progress' ? (
                <div className="w-4 h-4 rounded-sm border border-accent flex items-center justify-center text-accent-fg">
                  <Clock className="w-3 h-3" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-sm border border-line-strong" />
              )}
            </div>

            {/* Task Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag">
                  {item.phase.split(':')[0]}
                </span>
                <span className="tag">
                  {item.category}
                </span>
                <span className="text-xs text-fg-subtle">
                  Impact <span className={item.impact === 'Critical' ? 'text-fg font-medium' : 'text-fg-muted'}>{item.impact}</span>
                </span>
                <span className="text-xs text-fg-subtle">
                  Effort <span className="text-fg-muted">{item.effort}</span>
                </span>
              </div>

              <h4 className={`text-sm font-semibold ${item.status === 'completed' ? 'line-through text-fg-subtle' : 'text-fg'}`}>
                {item.title}
              </h4>

              <p className="text-xs text-fg-muted leading-relaxed max-w-prose">
                {item.description}
              </p>
            </div>

            {/* Status Pill */}
            <div className="shrink-0 hidden sm:block">
              <span className={`text-xs capitalize ${
                item.status === 'in_progress'
                  ? 'text-accent-fg font-medium'
                  : 'text-fg-subtle'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Milestone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-surface border border-line rounded p-6 max-w-md w-full shadow-overlay relative space-y-5">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-fg-subtle hover:text-fg transition-colors p-1 rounded-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-semibold tracking-[-0.02em] text-fg">
              Add New Domination Milestone
            </h3>

            <form onSubmit={handleAddTask} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-medium text-fg-muted block mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Set up dynamic remarketing audience..."
                  className="field w-full"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-fg-muted block mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specific instructions or KPIs..."
                  className="field w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-fg-muted block mb-2">
                    Timeline Phase
                  </label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as any)}
                    className="field w-full"
                  >
                    <option value="Phase 1: 0-30 Days (Quick SEM Wins)">Phase 1: 0-30 Days</option>
                    <option value="Phase 2: 30-60 Days (Authority Acceleration)">Phase 2: 30-60 Days</option>
                    <option value="Phase 3: 60-90 Days (T1 Market Dominance)">Phase 3: 60-90 Days</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-fg-muted block mb-2">
                    Category Channel
                  </label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="field w-full"
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
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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
