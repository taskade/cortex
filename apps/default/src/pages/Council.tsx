import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { createConversation, createAgentChat } from '@/lib/agent-chat/v2';
import { isToolUIPart } from 'ai';
import type { UIMessage } from 'ai';
import { ulid } from 'ulidx';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Scale, ChevronRight, Loader2, AlertCircle, CheckCircle2, Send } from 'lucide-react';

// The 4 council agents that respond to the webhook
const COUNCIL_MEMBERS = [
  {
    id: '01KP2NYSV39GD3AVDGD4AYNA48',
    name: 'Strategist',
    emoji: '🧭',
    role: 'Counsel on a Decision',
    color: 'from-violet-500/10 to-purple-500/10',
    border: 'border-violet-500/30',
    headerBg: 'bg-violet-500/10',
    accent: 'text-violet-400',
    dot: 'bg-violet-400',
  },
  {
    id: '01KP2NYSV3Z89PXY39TNKRY8TR',
    name: 'Critic',
    emoji: '⚔️',
    role: 'Argue Against This',
    color: 'from-red-500/10 to-rose-500/10',
    border: 'border-red-500/30',
    headerBg: 'bg-red-500/10',
    accent: 'text-red-400',
    dot: 'bg-red-400',
  },
  {
    id: '01KP2NYSV3MX2MZNYJSFWT0R34',
    name: 'Researcher',
    emoji: '🔬',
    role: 'Verify the Claim',
    color: 'from-cyan-500/10 to-blue-500/10',
    border: 'border-cyan-500/30',
    headerBg: 'bg-cyan-500/10',
    accent: 'text-cyan-400',
    dot: 'bg-cyan-400',
  },
  {
    id: '01KP2NYSV3MB5JRCTY72P77C3F',
    name: 'Builder',
    emoji: '🔧',
    role: 'Spec It',
    color: 'from-emerald-500/10 to-green-500/10',
    border: 'border-emerald-500/30',
    headerBg: 'bg-emerald-500/10',
    accent: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
] as const;

type AgentState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'streaming'; chat: ReturnType<typeof createAgentChat> }
  | { status: 'done'; text: string }
  | { status: 'error'; message: string };

// Individual streaming panel per agent
function AgentPanel({
  member,
  prompt,
  active,
}: {
  member: typeof COUNCIL_MEMBERS[number];
  prompt: string;
  active: boolean;
}) {
  const [chat, setChat] = React.useState<ReturnType<typeof createAgentChat> | null>(null);
  const [agentState, setAgentState] = React.useState<AgentState>({ status: 'idle' });

  React.useEffect(() => {
    if (!active || !prompt) return;
    setAgentState({ status: 'loading' });
    setChat(null);

    let cancelled = false;
    (async () => {
      try {
        const { conversationId } = await createConversation(member.id);
        if (cancelled) return;
        const newChat = createAgentChat(member.id, conversationId);
        if (cancelled) return;
        setChat(newChat);
        setAgentState({ status: 'streaming', chat: newChat });
      } catch (e) {
        if (!cancelled) {
          setAgentState({ status: 'error', message: String(e) });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, prompt, member.id]);

  if (!active || agentState.status === 'idle') {
    return (
      <div
        className={cn(
          'rounded-xl border bg-gradient-to-br p-3 sm:p-4',
          member.color,
          member.border,
        )}
      >
        <AgentPanelHeader member={member} status="idle" />
        <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-muted-foreground italic">Awaiting the question…</div>
      </div>
    );
  }

  if (agentState.status === 'loading') {
    return (
      <div className={cn('rounded-xl border bg-gradient-to-br p-3 sm:p-4', member.color, member.border)}>
        <AgentPanelHeader member={member} status="loading" />
        <div className="mt-2 sm:mt-3 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Assembling…
        </div>
      </div>
    );
  }

  if (agentState.status === 'error') {
    return (
      <div className={cn('rounded-xl border bg-gradient-to-br p-3 sm:p-4', member.color, member.border)}>
        <AgentPanelHeader member={member} status="error" />
        <div className="mt-2 sm:mt-3 flex items-center gap-2 text-[10px] sm:text-xs text-red-400">
          <AlertCircle className="w-3 h-3" />
          {agentState.message}
        </div>
      </div>
    );
  }

  if (!chat) return null;

  return (
    <div className={cn('rounded-xl border bg-gradient-to-br p-3 sm:p-4', member.color, member.border)}>
      <AgentPanelHeader member={member} status="streaming" />
      <ActiveAgentChat chat={chat} member={member} prompt={prompt} />
    </div>
  );
}

function AgentPanelHeader({
  member,
  status,
}: {
  member: typeof COUNCIL_MEMBERS[number];
  status: 'idle' | 'loading' | 'streaming' | 'done' | 'error';
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-sm sm:text-lg">{member.emoji}</span>
        <div>
          <div className={cn('text-xs sm:text-sm font-semibold', member.accent)}>{member.name}</div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">{member.role}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {status === 'idle' && (
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
        )}
        {status === 'loading' && (
          <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
        )}
        {status === 'streaming' && (
          <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse', member.dot)} />
        )}
        {status === 'done' && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
        )}
      </div>
    </div>
  );
}

function ActiveAgentChat({
  chat,
  member,
  prompt,
}: {
  chat: ReturnType<typeof createAgentChat>;
  member: typeof COUNCIL_MEMBERS[number];
  prompt: string;
}) {
  const { messages, status, addToolApprovalResponse } = useChat({ chat, id: chat.id });
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    if (sent || !prompt) return;
    setSent(true);
    chat.sendMessage({
      id: ulid(),
      role: 'user',
      parts: [{ type: 'text', text: prompt }],
    });
  }, [chat, prompt, sent]);

  const isStreaming = status === 'submitted' || status === 'streaming';
  const assistantMessages = messages.filter((m) => m.role === 'assistant');

  return (
    <div className="mt-2 sm:mt-3">
      {isStreaming && assistantMessages.length === 0 && (
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
          <div className="flex gap-0.5">
            <div className={cn('w-1 h-1 rounded-full animate-bounce', member.dot)} style={{ animationDelay: '0ms' }} />
            <div className={cn('w-1 h-1 rounded-full animate-bounce', member.dot)} style={{ animationDelay: '150ms' }} />
            <div className={cn('w-1 h-1 rounded-full animate-bounce', member.dot)} style={{ animationDelay: '300ms' }} />
          </div>
          Thinking…
        </div>
      )}
      {assistantMessages.map((msg) => (
        <MessageContent key={msg.id} message={msg} onApprove={addToolApprovalResponse} />
      ))}
    </div>
  );
}

function MessageContent({
  message,
  onApprove,
}: {
  message: UIMessage;
  onApprove: ReturnType<typeof useChat>['addToolApprovalResponse'];
}) {
  return (
    <div className="space-y-2">
      {message.parts.map((part, i) => {
        const key = `${message.id}-${i}`;
        if (part.type === 'text') {
          return (
            <div key={key} className="prose prose-sm prose-invert max-w-none text-foreground/90 text-[11px] sm:text-xs leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
            </div>
          );
        }
        if (isToolUIPart(part)) {
          return (
            <div key={key} className="text-[10px] sm:text-xs text-muted-foreground italic flex items-center gap-1">
              <span>Tool: {part.toolName}</span>
              <span className="opacity-60">[{part.state}]</span>
              {part.state === 'approval-requested' && part.approval != null && (
                <span className="flex gap-1 ml-2">
                  <button
                    onClick={() => part.approval != null && onApprove({ id: part.approval.id, approved: true })}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => part.approval != null && onApprove({ id: part.approval.id, approved: false })}
                    className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Deny
                  </button>
                </span>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < breakpoint);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export function Council() {
  const [decision, setDecision] = React.useState('');
  const [context, setContext] = React.useState('');
  const isMobile = useIsMobile();
  const [convened, setConvened] = React.useState(false);
  const [activePrompt, setActivePrompt] = React.useState('');
  const [webhookFired, setWebhookFired] = React.useState(false);
  const [webhookError, setWebhookError] = React.useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const canConvene = decision.trim().length > 5;

  async function handleConvene() {
    if (!canConvene) return;

    const prompt = `Decision: ${decision.trim()}\n\nContext: ${context.trim() || 'No additional context provided.'}`;
    setActivePrompt(prompt);
    setConvened(true);
    setWebhookFired(false);
    setWebhookError(null);

    // Fire the Decision Council webhook (for Decision Log persistence)
    try {
      await fetch('/api/taskade/webhooks/01KP2NYSV32Y1Y298SYBDK79DR/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: decision.trim(), context: context.trim() }),
      });
      setWebhookFired(true);
    } catch {
      setWebhookError('Decision Log sync failed — live responses still active.');
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  function handleReset() {
    setConvened(false);
    setActivePrompt('');
    setDecision('');
    setContext('');
    setWebhookFired(false);
    setWebhookError(null);
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Decision Council</h1>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-xl">
          Type a decision. The council assembles — 4 agents pressure-test it from every angle before you commit.
        </p>
      </div>

      {/* Input form */}
      <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm mb-5 sm:mb-8">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
              The Decision *
            </label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder={isMobile ? "e.g. We should raise a seed round now instead of staying default-alive." : "e.g. We should raise a $3M seed round now instead of staying default-alive for another 18 months."}
              rows={isMobile ? 2 : 3}
              disabled={convened}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 resize-none disabled:opacity-60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
              Context <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={isMobile ? "e.g. $45k MRR, 15% MoM growth, 18 months runway." : "e.g. We're at $45k MRR, growing 15% MoM, 18 months runway. Main competitor just raised $10M."}
              rows={2}
              disabled={convened}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 resize-none disabled:opacity-60 transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {webhookFired && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Logged to Decision Log</span>
                </>
              )}
              {webhookError && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-[#ffcf40]" />
                  <span className="text-[#ffcf40]">{webhookError}</span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {convened && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-colors"
                >
                  New Decision
                </button>
              )}
              <button
                onClick={handleConvene}
                disabled={!canConvene || convened}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200',
                  canConvene && !convened
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5'
                    : convened && webhookFired
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 cursor-default'
                      : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
              >
                {convened ? (
                  webhookFired ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Council convened
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                      Council in session
                    </>
                  )
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Convene Council
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Council members (always visible, activate on convene) */}
      <div ref={resultsRef}>
        {convened && (
          <div className="mb-3 sm:mb-4 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
            {webhookFired ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Council has spoken — responses below.</span>
              </>
            ) : (
              <>
                <div className="flex gap-1">
                  {COUNCIL_MEMBERS.map((m) => (
                    <div key={m.id} className={cn('w-1.5 h-1.5 rounded-full animate-pulse', m.dot)} />
                  ))}
                </div>
                The council is deliberating…
              </>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {COUNCIL_MEMBERS.map((member) => (
            <AgentPanel
              key={member.id}
              member={member}
              prompt={activePrompt}
              active={convened}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
