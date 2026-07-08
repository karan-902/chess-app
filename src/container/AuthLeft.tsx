import { useState, useEffect } from "react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";

interface IAuthLeftProps {
    variant: "login" | "register";
}

const CONTENT = {
    login: {
        headline: (
            <>
                Your next move
                <br />
                awaits, Champion.
            </>
        ),
        desc: "Welcome back to the arena. Your opponents are waiting — are you ready?",
        features: [
            {
                icon: "⚡",
                title: "Pick Up Where You Left",
                sub: "Resume your ranked streak instantly",
            },
            {
                icon: "🏆",
                title: "Leaderboard Standing",
                sub: "See how you rank against the world",
            },
            {
                icon: "◈",
                title: "Wallet Ready",
                sub: "Your ETH balance is waiting to grow",
            },
        ],
        quotes: [
            {
                text: "I always believed if I work hard and keep improving, I can achieve anything in chess.",
                author: "Gukesh Dommaraju",
                title: "World Chess Champion 2024",
            },
            {
                text: "Every chess master was once a beginner. The key is to never stop learning.",
                author: "Irving Chernev",
                title: "Chess Author & Player",
            },
            {
                text: "Chess is the art of analysis. You must train yourself to think several moves ahead.",
                author: "Mikhail Botvinnik",
                title: "6th World Chess Champion",
            },
        ],
        glow: "login",
    },
    register: {
        headline: (
            <>
                Play Chess.
                <br />
                Stake Crypto.
                <br />
                Dominate.
            </>
        ),
        desc: "The world's first chess platform where every move carries real stakes.",
        features: [
            {
                icon: "♟",
                title: "Real-time Matchmaking",
                sub: "Play against ranked opponents worldwide",
            },
            {
                icon: "◈",
                title: "Crypto Stakes",
                sub: "Wager ETH and win real rewards",
            },
            {
                icon: "★",
                title: "ELO Rating System",
                sub: "Track and grow your competitive ranking",
            },
        ],
        quotes: [
            {
                text: "Chess is not just about the board — it's about the courage to make the decisive move.",
                author: "Magnus Carlsen",
                title: "5x World Chess Champion",
            },
            {
                text: "Chess is everything: art, science, and sport. It demands the very best of a human being.",
                author: "Anatoly Karpov",
                title: "12th World Chess Champion",
            },
            {
                text: "When you see a good move, look for a better one. Chess rewards patience above all.",
                author: "Emanuel Lasker",
                title: "2nd World Chess Champion",
            },
        ],
        glow: "register",
    },
};

export default function AuthLeft({ variant }: IAuthLeftProps) {
    const c = CONTENT[variant];
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setActive((prev) => (prev + 1) % c.quotes.length);
                setFading(false);
            }, 300);
        }, 4500);
        return () => clearInterval(timer);
    }, [c.quotes.length]);

    const goTo = (i: number) => {
        if (i === active) return;
        setFading(true);
        setTimeout(() => {
            setActive(i);
            setFading(false);
        }, 300);
    };

    const q = c.quotes[active];

    return (
        <Box customClass="auth-left">
            <Box customClass={`auth-left-glow auth-left-glow--${c.glow}`} />

            <Box customClass="auth-left-content">
                <Box customClass="auth-left-brand">
                    <Text as="span" customClass="auth-left-logo">
                        ♛
                    </Text>
                    <Text as="span" customClass="auth-left-name">
                        KINGSTAKE
                    </Text>
                    <Text as="p" customClass="auth-left-tagline">
                        Chess · Crypto · Competition
                    </Text>
                </Box>

                <Box customClass="auth-left-headline">
                    <Text as="h2" customClass="auth-left-h2">
                        {c.headline}
                    </Text>
                    <Text as="p" customClass="auth-left-desc">
                        {c.desc}
                    </Text>
                </Box>

                <Box customClass="auth-left-features">
                    {c.features.map((f) => (
                        <Box key={f.title} customClass="auth-left-feature">
                            <Box customClass="auth-left-feature-icon">
                                <Text as="span">{f.icon}</Text>
                            </Box>
                            <Box customClass="auth-left-feature-text">
                                <Text
                                    as="span"
                                    customClass="auth-left-feature-title"
                                >
                                    {f.title}
                                </Text>
                                <Text
                                    as="span"
                                    customClass="auth-left-feature-sub"
                                >
                                    {f.sub}
                                </Text>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box customClass="auth-left-quote">
                    <Box
                        customClass={`auth-left-quote-body${fading ? " auth-left-quote-body--fade" : ""}`}
                    >
                        <Text as="p" customClass="auth-left-quote-text">
                            "{q.text}"
                        </Text>
                        <Box customClass="auth-left-quote-meta">
                            <Text
                                as="span"
                                customClass="auth-left-quote-author"
                            >
                                {q.author}
                            </Text>
                            <Text as="span" customClass="auth-left-quote-title">
                                {q.title}
                            </Text>
                        </Box>
                    </Box>
                    <Box customClass="auth-left-quote-dots">
                        {c.quotes.map((_, i) => (
                            <button
                                key={i}
                                className={`auth-left-dot${i === active ? " auth-left-dot--active" : ""}`}
                                onClick={() => goTo(i)}
                                aria-label={`Quote ${i + 1}`}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
