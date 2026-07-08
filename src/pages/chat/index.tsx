import { useState, useRef, useEffect } from "react";
import { Search, Send, ArrowLeft, MessageCircle, Users, Swords } from "lucide-react";
import clsx from "clsx";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { useReduxSelector } from "@/store/hooks";
import "./chat.scss";

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatTab = "recent" | "online" | "opponents";

interface IMessage {
    id: string;
    senderId: string;
    text: string;
    time: string;
}

interface IConversation {
    id: string;
    userId: string;
    userName: string;
    initial: string;
    online: boolean;
    lastMessage: string;
    lastTime: string;
    unread: number;
}

interface IOpponent {
    userId: string;
    userName: string;
    initial: string;
    online: boolean;
    result: "win" | "lose" | "draw";
    stake: string;
    playedAt: string;
    conversationId?: string;
}

// ── Mock data — replace with API calls ───────────────────────────────────────

const MOCK_CONVERSATIONS: IConversation[] = [
    { id: "c1", userId: "u1", userName: "GrandMasterX",  initial: "G", online: true,  lastMessage: "Good game! Rematch?",      lastTime: "2m",  unread: 2 },
    { id: "c2", userId: "u2", userName: "Karpov_99",      initial: "K", online: false, lastMessage: "gg wp",                   lastTime: "1h",  unread: 0 },
    { id: "c3", userId: "u3", userName: "DeepBlue_7",     initial: "D", online: true,  lastMessage: "I'll get you next time",  lastTime: "3h",  unread: 1 },
    { id: "c4", userId: "u4", userName: "NightCrawler",   initial: "N", online: false, lastMessage: "Nice Sicilian defense",   lastTime: "1d",  unread: 0 },
    { id: "c5", userId: "u5", userName: "PawnStorm",      initial: "P", online: false, lastMessage: "Let's play again",        lastTime: "2d",  unread: 0 },
];

const MOCK_OPPONENTS: IOpponent[] = [
    { userId: "u1", userName: "GrandMasterX",  initial: "G", online: true,  result: "lose", stake: "0.10 ETH", playedAt: "2h ago",  conversationId: "c1" },
    { userId: "u2", userName: "Karpov_99",      initial: "K", online: false, result: "win",  stake: "0.05 ETH", playedAt: "5h ago",  conversationId: "c2" },
    { userId: "u3", userName: "DeepBlue_7",     initial: "D", online: true,  result: "win",  stake: "0.25 ETH", playedAt: "1d ago",  conversationId: "c3" },
    { userId: "u4", userName: "NightCrawler",   initial: "N", online: false, result: "draw", stake: "0.10 ETH", playedAt: "2d ago",  conversationId: "c4" },
    { userId: "u6", userName: "Magnus_Fan",     initial: "M", online: true,  result: "lose", stake: "0.01 ETH", playedAt: "3d ago"                      },
    { userId: "u7", userName: "QueenSacrifice", initial: "Q", online: false, result: "win",  stake: "0.50 ETH", playedAt: "4d ago"                      },
];

const TABS: { id: ChatTab; label: string; icon: React.ElementType }[] = [
    { id: "recent",    label: "Recent",    icon: MessageCircle },
    { id: "online",    label: "Online",    icon: Users         },
    { id: "opponents", label: "Opponents", icon: Swords        },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function q(s: string) { return s.toLowerCase(); }

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ initial, online, size = "md" }: { initial: string; online?: boolean; size?: "sm" | "md" }) {
    return (
        <Box customClass={clsx("chat-avatar", `chat-avatar--${size}`)}>
            <span className="chat-avatar-initial">{initial}</span>
            {online && <span className="chat-avatar-dot" />}
        </Box>
    );
}

function EmptyState({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
    return (
        <Box customClass="chat-empty-state">
            <Icon size={32} strokeWidth={1.2} className="chat-empty-state-icon" />
            <Text as="p" customClass="chat-empty-state-title">{title}</Text>
            <Text as="p" customClass="chat-empty-state-sub">{sub}</Text>
        </Box>
    );
}

const RESULT_LABEL: Record<IOpponent["result"], string> = { win: "WON", lose: "LOST", draw: "DRAW" };

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatPage() {
    const session = useReduxSelector((s) => s.auth.session);
    const myId = session?.user_id ?? "me";

    const [activeTab, setActiveTab] = useState<ChatTab>("recent");
    const [search, setSearch] = useState("");
    const [conversations, setConversations] = useState<IConversation[]>(MOCK_CONVERSATIONS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, IMessage[]>>({});
    const [draft, setDraft] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const selected = conversations.find(c => c.id === selectedId) ?? null;
    const activeMessages = selectedId ? (messages[selectedId] ?? []) : [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages.length]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const openConversation = (userId: string, userName: string, initial: string, online: boolean) => {
        const existing = conversations.find(c => c.userId === userId);
        if (existing) {
            setSelectedId(existing.id);
            setConversations(prev => prev.map(c => c.id === existing.id ? { ...c, unread: 0 } : c));
            return;
        }
        const newConv: IConversation = {
            id: crypto.randomUUID(),
            userId, userName, initial, online,
            lastMessage: "", lastTime: "", unread: 0,
        };
        setConversations(prev => [newConv, ...prev]);
        setSelectedId(newConv.id);
    };

    const handleSend = () => {
        if (!draft.trim() || !selectedId) return;
        const msg: IMessage = {
            id: crypto.randomUUID(),
            senderId: myId,
            text: draft.trim(),
            time: formatTime(new Date()),
        };
        setMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), msg] }));
        setConversations(prev =>
            prev.map(c => c.id === selectedId ? { ...c, lastMessage: msg.text, lastTime: "now" } : c)
        );
        setDraft("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    // ── Filtered lists per tab ────────────────────────────────────────────────

    const filteredRecent = conversations
        .filter(c => q(c.userName).includes(q(search)));

    const filteredOnline = conversations
        .filter(c => c.online && q(c.userName).includes(q(search)));

    const filteredOpponents = MOCK_OPPONENTS
        .filter(o => q(o.userName).includes(q(search)));

    const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <Box customClass="chat-page">

            {/* ── Left panel ────────────────────────────────────── */}
            <Box customClass={clsx("chat-list-panel", selected && "chat-list-panel--hidden-mobile")}>

                {/* Search */}
                <Box customClass="chat-search-wrap">
                    <Search size={14} className="chat-search-icon" />
                    <input
                        className="chat-search-input"
                        placeholder="Search username…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </Box>

                {/* Tabs */}
                <Box customClass="chat-tabs">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={clsx("chat-tab-btn", activeTab === id && "active")}
                            onClick={() => setActiveTab(id)}
                        >
                            <Icon size={12} strokeWidth={2} />
                            <span>{label}</span>
                            {id === "recent" && totalUnread > 0 && (
                                <span className="chat-tab-badge">{totalUnread}</span>
                            )}
                            {id === "online" && (
                                <span className="chat-tab-online-dot" />
                            )}
                        </button>
                    ))}
                </Box>

                {/* List */}
                <Box customClass="chat-list">

                    {/* Recent tab */}
                    {activeTab === "recent" && (
                        filteredRecent.length === 0
                            ? <EmptyState icon={MessageCircle} title="No messages" sub={search ? "No users match your search" : "Search a username to start chatting"} />
                            : filteredRecent.map(conv => (
                                <button
                                    key={conv.id}
                                    className={clsx("chat-conv-item", selectedId === conv.id && "active")}
                                    onClick={() => openConversation(conv.userId, conv.userName, conv.initial, conv.online)}
                                >
                                    <Avatar initial={conv.initial} online={conv.online} />
                                    <Box customClass="chat-conv-body">
                                        <Box customClass="chat-conv-top">
                                            <Text as="span" customClass="chat-conv-name">{conv.userName}</Text>
                                            <Text as="span" customClass="chat-conv-time">{conv.lastTime}</Text>
                                        </Box>
                                        <Box customClass="chat-conv-bottom">
                                            <Text as="span" customClass="chat-conv-last">{conv.lastMessage || "No messages yet"}</Text>
                                            {conv.unread > 0 && <span className="chat-unread-badge">{conv.unread}</span>}
                                        </Box>
                                    </Box>
                                </button>
                            ))
                    )}

                    {/* Online tab */}
                    {activeTab === "online" && (
                        filteredOnline.length === 0
                            ? <EmptyState icon={Users} title="Nobody online" sub={search ? "No online users match your search" : "No contacts are online right now"} />
                            : filteredOnline.map(conv => (
                                <button
                                    key={conv.id}
                                    className={clsx("chat-conv-item", selectedId === conv.id && "active")}
                                    onClick={() => openConversation(conv.userId, conv.userName, conv.initial, conv.online)}
                                >
                                    <Avatar initial={conv.initial} online />
                                    <Box customClass="chat-conv-body">
                                        <Box customClass="chat-conv-top">
                                            <Text as="span" customClass="chat-conv-name">{conv.userName}</Text>
                                            <span className="chat-online-label">online</span>
                                        </Box>
                                        <Text as="span" customClass="chat-conv-last">{conv.lastMessage || "Tap to message"}</Text>
                                    </Box>
                                </button>
                            ))
                    )}

                    {/* Opponents tab */}
                    {activeTab === "opponents" && (
                        filteredOpponents.length === 0
                            ? <EmptyState icon={Swords} title="No opponents yet" sub={search ? "No opponents match your search" : "Play a match to see your opponents here"} />
                            : filteredOpponents.map(opp => (
                                <Box key={opp.userId} customClass="chat-opp-item">
                                    <Avatar initial={opp.initial} online={opp.online} />
                                    <Box customClass="chat-opp-body">
                                        <Box customClass="chat-opp-top">
                                            <Text as="span" customClass="chat-conv-name">{opp.userName}</Text>
                                            {opp.online && <span className="chat-online-label">online</span>}
                                        </Box>
                                        <Box customClass="chat-opp-meta">
                                            <span className={clsx("chat-result-badge", `chat-result-badge--${opp.result}`)}>
                                                {RESULT_LABEL[opp.result]}
                                            </span>
                                            <Text as="span" customClass="chat-opp-info">{opp.stake} · {opp.playedAt}</Text>
                                        </Box>
                                    </Box>
                                    <button
                                        className="chat-msg-btn"
                                        onClick={() => openConversation(opp.userId, opp.userName, opp.initial, opp.online)}
                                    >
                                        <MessageCircle size={14} />
                                    </button>
                                </Box>
                            ))
                    )}

                </Box>
            </Box>

            {/* ── Chat window ───────────────────────────────────── */}
            <Box customClass={clsx("chat-window", !selected && "chat-window--empty", selected && "chat-window--visible-mobile")}>
                {selected ? (
                    <>
                        <Box customClass="chat-window-header">
                            <button className="chat-back-btn" onClick={() => setSelectedId(null)}>
                                <ArrowLeft size={16} />
                            </button>
                            <Avatar initial={selected.initial} online={selected.online} size="sm" />
                            <Box>
                                <Text as="p" customClass="chat-window-name">{selected.userName}</Text>
                                <Text as="p" customClass="chat-window-status">
                                    {selected.online ? "● Online" : "Offline"}
                                </Text>
                            </Box>
                        </Box>

                        <Box customClass="chat-messages">
                            {activeMessages.length === 0
                                ? <EmptyState icon={MessageCircle} title="No messages yet" sub={`Say hi to ${selected.userName}!`} />
                                : activeMessages.map(msg => {
                                    const isMine = msg.senderId === myId;
                                    return (
                                        <Box key={msg.id} customClass={clsx("chat-bubble-wrap", isMine && "chat-bubble-wrap--mine")}>
                                            <Box customClass={clsx("chat-bubble", isMine && "chat-bubble--mine")}>
                                                <Text as="span" customClass="chat-bubble-text">{msg.text}</Text>
                                            </Box>
                                            <Text as="span" customClass="chat-bubble-time">{msg.time}</Text>
                                        </Box>
                                    );
                                })
                            }
                            <div ref={bottomRef} />
                        </Box>

                        <Box customClass="chat-input-bar">
                            <input
                                className="chat-input"
                                placeholder="Type a message…"
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            <button className="chat-send-btn" onClick={handleSend} disabled={!draft.trim()}>
                                <Send size={16} />
                            </button>
                        </Box>
                    </>
                ) : (
                    <EmptyState icon={MessageCircle} title="Select a conversation" sub="Pick someone from the list or search a username" />
                )}
            </Box>
        </Box>
    );
}
