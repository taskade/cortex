import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Library as LibraryIcon,
  Brain,
  BookMarked,
  Search,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface ProjectNode {
  id: string;
  parentId: string | null;
  fieldValues: {
    '/text'?: string;
    '/attributes/note'?: string;
  };
}

interface TreeNode {
  id: string;
  text: string;
  note?: string;
  children: TreeNode[];
}

function buildTree(nodes: ProjectNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const n of nodes) {
    map.set(n.id, {
      id: n.id,
      text: n.fieldValues['/text'] ?? '',
      note: n.fieldValues['/attributes/note'],
      children: [],
    });
  }

  for (const n of nodes) {
    const node = map.get(n.id)!;
    if (n.parentId === null) {
      roots.push(node);
    } else {
      map.get(n.parentId)?.children.push(node);
    }
  }

  return roots;
}

function collectText(node: TreeNode): string {
  const lines: string[] = [node.text];
  for (const child of node.children) {
    lines.push(collectText(child));
  }
  return lines.join('\n');
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-150',
        copied
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border/50',
      )}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy
        </>
      )}
    </button>
  );
}

function TreeNodeRow({
  node,
  depth,
  query,
}: {
  node: TreeNode;
  depth: number;
  query: string;
}) {
  const [expanded, setExpanded] = React.useState(depth < 1);
  const isSection = depth === 0;
  const hasChildren = node.children.length > 0;
  const copyText = collectText(node);

  const highlight = (text: string) => {
    if (!query) return <>{text}</>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-[#ffcf40]/25 text-[#ffcf40] dark:text-[#ffcf40] rounded px-0.5">
              {part}
            </mark>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          ),
        )}
      </>
    );
  };

  if (!node.text) return null;

  if (isSection) {
    return (
      <div className="rounded-xl border border-border bg-card/60 overflow-hidden mb-3">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 text-left hover:bg-accent/30 transition-colors"
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
          )}
          <span className="font-semibold text-xs sm:text-sm text-foreground flex-1">{highlight(node.text)}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">{node.children.length} items</span>
        </button>
        {expanded && node.children.length > 0 && (
          <div className="border-t border-border/50">
            {node.children.map((child) => (
              <TreeNodeRow key={child.id} node={child} depth={1} query={query} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Leaf / framework entry
  return (
    <div className="group px-3 py-2.5 sm:px-4 sm:py-3 border-b border-border/30 last:border-0 hover:bg-accent/20 transition-colors">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-medium text-foreground mb-1">{highlight(node.text)}</div>
          {node.note && (
            <div className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{highlight(node.note)}</div>
          )}
          {hasChildren && (
            <div className="mt-1.5 sm:mt-2 space-y-1">
              {node.children.map((child) => (
                <div key={child.id} className="text-[11px] sm:text-xs text-muted-foreground/80 pl-2.5 sm:pl-3 border-l border-border/40 leading-relaxed">
                  {highlight(child.text)}
                  {child.children.map((gc) => (
                    <div key={gc.id} className="mt-0.5 pl-2.5 sm:pl-3 border-l border-border/30 text-muted-foreground/60">
                      {highlight(gc.text)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={copyText} />
        </div>
      </div>
    </div>
  );
}

function ProjectSection({
  projectId,
  title,
  icon: Icon,
  externalUrl,
  accentClass,
  query,
}: {
  projectId: string;
  title: string;
  icon: React.ElementType;
  externalUrl: string;
  accentClass: string;
  query: string;
}) {
  const [nodes, setNodes] = React.useState<ProjectNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/taskade/projects/${projectId}/nodes`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setNodes(data.payload.nodes);
        else setError('Failed to load.');
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const tree = React.useMemo(() => buildTree(nodes), [nodes]);

  const filteredTree = React.useMemo(() => {
    if (!query.trim()) return tree;
    const q = query.toLowerCase();
    function nodeMatches(n: TreeNode): boolean {
      if (n.text.toLowerCase().includes(q)) return true;
      if ((n.note ?? '').toLowerCase().includes(q)) return true;
      return n.children.some(nodeMatches);
    }
    return tree.filter(nodeMatches);
  }, [tree, query]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('p-1 sm:p-1.5 rounded-lg', accentClass)}>
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h2 className="font-semibold text-sm sm:text-base text-foreground">{title}</h2>
        </div>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open
        </a>
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-card animate-pulse border border-border" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[11px] sm:text-xs">
          <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && filteredTree.length === 0 && (
        <div className="py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground">
          {query ? 'No results match.' : 'No content found.'}
        </div>
      )}

      {!loading && !error && filteredTree.length > 0 && (
        <div>
          {filteredTree.map((node) => (
            <TreeNodeRow key={node.id} node={node} depth={0} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Library() {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState<'frameworks' | 'references'>('frameworks');

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <LibraryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Library</h1>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Mental models, frameworks, essential reading, and key references — with quick-copy.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search frameworks, books, tools, metrics…"
          className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted mb-4 sm:mb-6 w-fit">
        {(
          [
            { key: 'frameworks', label: 'Mental Models', icon: Brain },
            { key: 'references', label: 'References', icon: BookMarked },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150',
              tab === key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'frameworks' && (
        <ProjectSection
          projectId="9T9rrVHjc59ayGQh"
          title="Mental Models & Frameworks"
          icon={Brain}
          externalUrl="https://staging.taskade.dev/d/9T9rrVHjc59ayGQh"
          accentClass="bg-teal-500/10 text-teal-500"
          query={query}
        />
      )}
      {tab === 'references' && (
        <ProjectSection
          projectId="x4Wxw3NruLd78emT"
          title="Library — References"
          icon={BookMarked}
          externalUrl="https://staging.taskade.dev/d/x4Wxw3NruLd78emT"
          accentClass="bg-cyan-500/10 text-cyan-400"
          query={query}
        />
      )}
    </div>
  );
}
