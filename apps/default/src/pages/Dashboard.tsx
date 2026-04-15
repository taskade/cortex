import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AGENTS, PROJECTS, AUTOMATIONS } from '@/data/workspace';
import {
  ExternalLink,
  Clock,
  Webhook,
  CalendarClock,
  ArrowRight,
  Layers,
  Bot,
  Workflow,
} from 'lucide-react';

function SectionHeader({
  icon: Icon,
  title,
  count,
  action,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-md bg-muted">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <h2 className="font-semibold text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {action} <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: typeof AGENTS[number] }) {
  const navigate = useNavigate();
  const isCouncilAgent =
    agent.name === 'Strategist' ||
    agent.name === 'Critic' ||
    agent.name === 'Researcher' ||
    agent.name === 'Builder';

  return (
    <button
      onClick={() => isCouncilAgent && navigate('/council')}
      className={cn(
        'group relative text-left p-4 rounded-xl border bg-card dark:bg-gradient-to-br transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
        agent.color,
        agent.border,
        isCouncilAgent ? 'cursor-pointer' : 'cursor-default',
      )}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="text-lg sm:text-2xl">{agent.emoji}</div>
        <span className={cn('text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium', agent.badge)}>
          Agent
        </span>
      </div>
      <div className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">{agent.name}</div>
      <div className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2 leading-relaxed line-clamp-2">
        {agent.description}
      </div>
      <div className="text-[10px] sm:text-xs text-muted-foreground/70 font-mono">{agent.role}</div>
      {isCouncilAgent && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-medium text-foreground flex items-center gap-1">
            Open Council <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      )}
    </button>
  );
}

const CATEGORY_ORDER = ['Core', 'Library', 'Playbooks'] as const;
const CATEGORY_COLORS: Record<string, string> = {
  Core: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  Library: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Playbooks: 'bg-[#ffcf40]/10 text-[#ffcf40] border-[#ffcf40]/20',
};

function ProjectCard({ project }: { project: typeof PROJECTS[number] }) {
  const catColor = CATEGORY_COLORS[project.category] ?? 'bg-muted text-muted-foreground';

  return (
    <a
      href={project.taskadeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-border/80 hover:bg-accent/50 transition-all duration-150"
    >
      <div className="text-base sm:text-xl flex-shrink-0">{project.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
          <span className="text-xs sm:text-sm font-medium text-foreground truncate">{project.name}</span>
          <span className={cn('text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded border flex-shrink-0', catColor)}>
            {project.category}
          </span>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{project.description}</div>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 text-xs text-muted-foreground/60">
        <Clock className="w-3 h-3" />
        <span>{project.lastModified}</span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
      </div>
    </a>
  );
}

function AutomationCard({ automation }: { automation: typeof AUTOMATIONS[number] }) {
  const isWebhook = automation.trigger === 'Webhook';
  const navigate = useNavigate();
  const isCouncil = automation.id === '01KP2NYSV32Y1Y298SYBDK79DR';

  return (
    <button
      onClick={() => (isCouncil ? navigate('/council') : window.open(automation.taskadeUrl, '_blank'))}
      className={cn(
        'group text-left w-full p-4 rounded-xl border bg-card dark:bg-gradient-to-br transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        automation.color,
        automation.border,
      )}
    >
      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
        <span className="text-base sm:text-xl">{automation.emoji}</span>
        <div className="flex items-center gap-1 sm:gap-1.5">
          {isWebhook ? (
            <Webhook className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
          ) : (
            <CalendarClock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
          )}
          <span className="text-[10px] sm:text-xs text-muted-foreground">{automation.trigger}</span>
        </div>
      </div>
      <div className="font-semibold text-xs sm:text-sm text-foreground mb-0.5 sm:mb-1">{automation.name}</div>
      <div className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed mb-2 sm:mb-3 line-clamp-2">
        {automation.description}
      </div>
      <div className="flex flex-wrap gap-1">
        {automation.agents.map((a) => (
          <span
            key={a}
            className="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded bg-background/60 text-muted-foreground border border-border/50"
          >
            {a}
          </span>
        ))}
      </div>
    </button>
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  const projectsByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    projects: PROJECTS.filter((p) => p.category === cat),
  }));

  return (
    <div className="px-6 py-4 sm:py-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          Good morning, Cortex.
        </h1>
        <p className="text-muted-foreground text-xs sm:text-base">
          {AGENTS.length} agents · {PROJECTS.length} projects · {AUTOMATIONS.length} automations — all alive.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-10">
        {[
          { icon: Bot, label: 'Agents', value: AGENTS.length, color: 'text-teal-500' },
          { icon: Layers, label: 'Projects', value: PROJECTS.length, color: 'text-cyan-400' },
          { icon: Workflow, label: 'Automations', value: AUTOMATIONS.length, color: 'text-emerald-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-2.5 sm:p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={cn('p-1.5 sm:p-2.5 rounded-lg bg-muted flex-shrink-0', color)}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{value}</div>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{label}</div>
          </div>
        ))}
      </div>

      {/* Agents */}
      <section className="mb-10">
        <SectionHeader
          icon={Bot}
          title="Agents"
          count={AGENTS.length}
          action="Open Council"
          onAction={() => navigate('/council')}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-10">
        <SectionHeader icon={Layers} title="Projects" count={PROJECTS.length} />
        <div className="space-y-6">
          {projectsByCategory.map(({ category, projects }) => (
            <div key={category}>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 ml-1">
                {category}
              </div>
              <div className="space-y-1.5">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Automations */}
      <section>
        <SectionHeader
          icon={Workflow}
          title="Automations"
          count={AUTOMATIONS.length}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AUTOMATIONS.map((a) => (
            <AutomationCard key={a.id} automation={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
