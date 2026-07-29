import { Fragment, useState, useEffect } from "react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import KingStakeLogo from "@/components/constants";
import {
    authLeftQuoteAriaLabel,
    authLeftBrandName,
    authLeftTagline,
    authLeftLoginHeadlineLines,
    authLeftLoginDesc,
    authLeftLoginFeatures,
    authLeftLoginQuotes,
    authLeftRegisterHeadlineLines,
    authLeftRegisterDesc,
    authLeftRegisterFeatures,
    authLeftRegisterQuotes,
} from "@/components/messages";

interface IAuthLeftProps {
    variant: "login" | "register";
}

const CONTENT = {
    login: {
        headlineLines: authLeftLoginHeadlineLines,
        desc: authLeftLoginDesc,
        features: authLeftLoginFeatures,
        quotes: authLeftLoginQuotes,
        glow: "login",
    },
    register: {
        headlineLines: authLeftRegisterHeadlineLines,
        desc: authLeftRegisterDesc,
        features: authLeftRegisterFeatures,
        quotes: authLeftRegisterQuotes,
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
                    <KingStakeLogo size={26} showText={false} />
                    <Text as="span" customClass="auth-left-name">
                        {authLeftBrandName}
                    </Text>
                    <Text as="p" customClass="auth-left-tagline">
                        {authLeftTagline}
                    </Text>
                </Box>

                <Box customClass="auth-left-headline">
                    <Text as="h2" customClass="auth-left-h2">
                        {c.headlineLines.map((line, i) => (
                            <Fragment key={line}>
                                {i > 0 && <br />}
                                {line}
                            </Fragment>
                        ))}
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
                            <Button
                                key={i}
                                variant="ghost"
                                customClass={`auth-left-dot${i === active ? " auth-left-dot--active" : ""}`}
                                onClick={() => goTo(i)}
                                aria-label={authLeftQuoteAriaLabel(i + 1)}
                            >
                                {null}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
