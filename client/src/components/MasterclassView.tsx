import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { MasterclassData, MasterclassMethod, MasterclassModule } from '../types';
import {
  BookOpen,
  Search,
  Code2,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Filter,
  GraduationCap,
  Layers,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MasterclassViewProps {
  onSelectQuestion?: (id: string) => void;
  onNavigateToBank?: (bank: 'bank1' | 'bank2') => void;
}

export const MasterclassView: React.FC<MasterclassViewProps> = ({
  onSelectQuestion,
  onNavigateToBank
}) => {
  const [data, setData] = useState<MasterclassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active view tab: 'methods' (A-Z reference) vs 'curriculum' (Modules 1-18)
  const [activeTab, setActiveTab] = useState<'methods' | 'curriculum'>('methods');

  // Filters for A-Z methods
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Collapsed state for curriculum modules
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-01': true,
    'mod-07': true
  });

  useEffect(() => {
    async function loadMasterclass() {
      try {
        setLoading(true);
        const res = await api.getMasterclass();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load masterclass');
      } finally {
        setLoading(false);
      }
    }
    loadMasterclass();
  }, []);

  const handleCopy = (snippet: string, key: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(key);
    setTimeout(() => {
      setCopiedSnippet(null);
    }, 2000);
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtered methods
  const filteredMethods = useMemo(() => {
    if (!data) return [];
    return data.methods.filter(m => {
      // Letter filter
      if (selectedLetter !== 'All' && m.letter !== selectedLetter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && m.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesClass = m.class.toLowerCase().includes(q);
        const matchesDesc = m.description.toLowerCase().includes(q);
        const matchesSig = m.signature.toLowerCase().includes(q);
        return matchesName || matchesClass || matchesDesc || matchesSig;
      }
      return true;
    });
  }, [data, selectedLetter, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading Java Masterclass & A-Z Reference...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-xl">
          <p className="font-semibold text-lg">Unable to load Masterclass</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Modern Java SE 21+ Masterclass</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Java Full Masterclass & A-to-Z Reference
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Complete reference manual adapted from <span className="text-emerald-400 font-medium">Modern Java</span> (by Bob McCue).
              Explore all Java methods, signatures, parameters, pitfalls, and structured curriculum modules.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{data.stats.totalModules}</div>
              <div className="text-xs text-slate-400 font-medium">Curriculum Modules</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-emerald-400">{data.stats.totalMethods}</div>
              <div className="text-xs text-slate-400 font-medium">A-Z Methods</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-xl font-bold text-cyan-400">{data.stats.categories.length}</div>
              <div className="text-xs text-slate-400 font-medium">Core Categories</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('methods')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              activeTab === 'methods'
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 font-bold'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>🔤 A-to-Z Methods & Functions Encyclopedia ({data.methods.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              activeTab === 'curriculum'
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 font-bold'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 Modern Java Textbook Curriculum (18 Chapters)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: A-TO-Z METHODS ENCYCLOPEDIA */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Category Chips */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any Java method, function, class or keyword (e.g. substring, nextInt, Arrays.sort, abs)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-700/50"
                >
                  Clear
                </button>
              )}
            </div>

            {/* A-Z Alphabet Picker */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3 h-3 text-emerald-400" /> Letter:
              </span>
              <button
                onClick={() => setSelectedLetter('All')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedLetter === 'All'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                All
              </button>
              {data.stats.alphabetIndex.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-7 h-7 text-xs rounded-md font-bold transition-colors ${
                    selectedLetter === letter
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" /> Category:
              </span>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All ({data.methods.length})
              </button>
              {data.stats.categories.map(cat => {
                const count = data.methods.filter(m => m.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-emerald-400">{filteredMethods.length}</strong> methods / functions
            </span>
            {(selectedLetter !== 'All' || selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedLetter('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-emerald-400 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Methods Cards Grid */}
          <div className="grid grid-cols-1 gap-5">
            {filteredMethods.map((method, idx) => {
              const isCopied = copiedSnippet === `method-${idx}`;
              return (
                <div
                  key={`${method.name}-${idx}`}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-6 transition-all duration-200 shadow-sm space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center">
                        {method.letter}
                      </span>
                      <h3 className="text-lg font-bold text-white font-mono">{method.name}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {method.class}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                        {method.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-mono">
                        returns {method.returnType}
                      </span>
                    </div>
                  </div>

                  {/* Method Signature Box */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-300/90 overflow-x-auto">
                    {method.signature}
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed">{method.description}</p>

                  {/* Parameters & Returns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    {method.parameters && method.parameters.length > 0 ? (
                      <div className="space-y-1.5">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                          Parameters:
                        </span>
                        <div className="space-y-1">
                          {method.parameters.map((p, pIdx) => (
                            <div key={pIdx} className="text-slate-300 bg-slate-850/60 p-2 rounded border border-slate-800">
                              <span className="text-cyan-400 font-mono font-semibold">{p.name}</span>
                              <span className="text-slate-500 font-mono"> ({p.type})</span>: {p.desc}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                          Parameters:
                        </span>
                        <p className="text-slate-500 italic">None (no arguments required)</p>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                        Returns & Exceptions:
                      </span>
                      <div className="text-slate-300 bg-slate-850/60 p-2 rounded border border-slate-800 space-y-1">
                        <div>
                          <strong className="text-emerald-400">Returns:</strong> {method.returns}
                        </div>
                        {method.exceptions && method.exceptions !== 'None.' && (
                          <div>
                            <strong className="text-rose-400">Exceptions:</strong> {method.exceptions}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Common Pitfalls / Tips */}
                  {method.pitfalls && (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-amber-300">Gotcha & Best Practice: </strong>
                        {method.pitfalls}
                      </div>
                    </div>
                  )}

                  {/* Runnable Code Snippet Box */}
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                      <span>Example Usage</span>
                      <button
                        onClick={() => handleCopy(method.snippet, `method-${idx}`)}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy snippet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      <code>{method.snippet}</code>
                    </pre>
                  </div>
                </div>
              );
            })}

            {filteredMethods.length === 0 && (
              <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <p className="text-base font-semibold text-white">No methods matched your filter</p>
                <p className="text-sm">Try broadening your search term or letter selection.</p>
                <button
                  onClick={() => {
                    setSelectedLetter('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: FULL MODERN JAVA TEXTBOOK CURRICULUM */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Modern Java Textbook Curriculum (18 Modules)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full structured syllabus from Bob McCue's Modern Java guide. Click any module to expand details.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const allExpanded: Record<string, boolean> = {};
                  data.modules.forEach(m => (allExpanded[m.id] = true));
                  setExpandedModules(allExpanded);
                }}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandedModules({})}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {data.modules.map(mod => {
              const isExpanded = !!expandedModules[mod.id];
              const isCopied = copiedSnippet === mod.id;

              return (
                <div
                  key={mod.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200"
                >
                  {/* Module Accordion Header */}
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-850/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {mod.id.toUpperCase()}
                        </span>
                        <h3 className="text-base font-bold text-white">{mod.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400">{mod.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4">
                      {/* Overview */}
                      <p className="text-sm text-slate-300 leading-relaxed mt-4">{mod.overview}</p>

                      {/* Key Takeaways */}
                      <div className="space-y-2 bg-slate-850/50 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Essential Rules & Takeaways:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {mod.keyTakeaways.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Code Snippet Box */}
                      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                          <span>Modern Java Code Example</span>
                          <button
                            onClick={() => handleCopy(mod.codeSnippet, mod.id)}
                            className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                          <code>{mod.codeSnippet}</code>
                        </pre>
                      </div>

                      {/* Quick Practice CTA */}
                      {onNavigateToBank && (
                        <div className="pt-2 flex items-center justify-end">
                          <button
                            onClick={() => onNavigateToBank('bank2')}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <span>Practice related questions in Question Bank 2</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
