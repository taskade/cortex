import * as React from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  Search,
  ExternalLink,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface ProjectNode {
  id: string;
  parentId: string | null;
  fieldValues: {
    '/text'?: string;
    '/attributes/note'?: string;
  };
}

interface DecisionEntry {
  id: string;
  title: string;
  children: ProjectNode[];
}

function buildTree(nodes: ProjectNode[]): { sections: DecisionEntry[] } {
  // Find top-level h2 nodes (section headings) — parentId is null or root
  const rootIds = new Set(nodes.filter((n) => n.parentId === null).map((n) => n.id));
  const childrenOf = (parentId: string) => nodes.filter((n) => n.parentId === parentId);

  const sections: DecisionEntry[] = [];

  // Find all nodes that could be decision entries (those under the "Decisions" heading)
  for (const rootNode of nodes.filter((n) => n.parentId === null)) {
    const title = rootNode.fieldValues['/text'] ?? '';
    if (!title) continue;
    sections.push({
      id: rootNode.id,
      title,
      children: childrenOf(rootNode.id),
    });
  }

  return { sections };
}

function nodeText(node: ProjectNode): string {
  return node.fieldValues['/text'] ?? '';
}

function EntryCard({ entry, query }: { entry: DecisionEntry; query: string }) {
  const [expanded, setExpanded] = React.useState(false);

  // Highlight match
  const highlight = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#ffcf40]/25 text-[#ffcf40] dark:text-[#ffcf40] rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const isWide = entry.title.includes('Decision Council') || entry.title.includes('War Room');
  const contentText = entry.children.map((c) => nodeText(c)).join(' ');

  return (
    <div className="rounded-xl border border-border bg-card/60 overflow-hidden hover:border-border/80 transition-colors">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-2 sm:gap-3 p-3 sm:p-4 text-left hover:bg-accent/30 transition-colors"
      >
        <div className="flex-shrink-0 mt-0.5">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs sm:text-sm text-foreground mb-1">
            {highlight(entry.title)}
          </div>
          {!expanded && contentText && (
            <div className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
              {contentText.substring(0, 160)}…
            </div>
          )}
          {isWide && (
            <div className="mt-1">
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Council
              </span>
            </div>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 border-t border-border/50">
          <div className="mt-2 sm:mt-3 space-y-1.5">
            {entry.children.map((child) => {
              const text = nodeText(child);
              if (!text) return null;
              return (
                <div key={child.id} className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {highlight(text)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 space-y-2 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-5/6" />
    </div>
  );
}

export function Journal() {
  const [nodes, setNodes] = React.useState<ProjectNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/taskade/projects/R5cAQa4pU2hA7jMr/nodes')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setNodes(data.payload.nodes);
        } else {
          setError('Failed to load Decision Log.');
        }
      })
      .catch(() => setError('Network error loading Decision Log.'))
      .finally(() => setLoading(false));
  }, []);

  // Build flat list of all non-root entries that have content
  const entries: DecisionEntry[] = React.useMemo(() => {
    if (!nodes.length) return [];
    const topLevel = nodes.filter((n) => n.parentId === null);
    const childrenOf = (id: string) => nodes.filter((n) => n.parentId === id);

    const result: DecisionEntry[] = [];
    for (const top of topLevel) {
      const title = top.fieldValues['/text'] ?? '';
      if (!title) continue;
      // Each top-level node + its children as one entry
      result.push({ id: top.id, title, children: childrenOf(top.id) });
    }
    return result;
  }, [nodes]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) => {
      const titleMatch = e.title.toLowerCase().includes(q);
      const childMatch = e.children.some((c) =>
        (c.fieldValues['/text'] ?? '').toLowerCase().includes(q),
      );
      return titleMatch || childMatch;
    });
  }, [entries, query]);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-[#ffcf40]/10 border border-[#ffcf40]/20">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffcf40]" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Decision Journal</h1>
          <a
            href="https://staging.taskade.dev/d/R5cAQa4pU2hA7jMr"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Open in Taskade</span>
            <span className="sm:hidden">Open</span>
          </a>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Every major decision, its reasoning, and outcome — read-only, searchable.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decisions, context, outcomes…"
          className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#ffcf40]/40 focus:border-[#ffcf40]/40 transition-colors"
        />
      </div>

      {/* Results count */}
      {!loading && !error && query && (
        <div className="mb-3 sm:mb-4 text-[10px] sm:text-xs text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </div>
      )}

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 sm:p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-xs sm:text-sm">
            {query ? 'No decisions match that search.' : 'No decisions logged yet.'}
          </p>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mt-2 text-[10px] sm:text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}
