import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import BoardPreview from "@/components/board/BoardPreview";
import GameRoom from "./GameRoom";
import StakeSheet from "./StakeSheet";
import PracticeSheet from "./PracticeSheet";
import RoomSheet from "./RoomSheet";
import PoolConfirmSheet from "./PoolConfirmSheet";
import { usePools } from "@/hooks/usePools";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useRoomMatch } from "@/hooks/useRoomMatch";
import { useWalletBalance } from "@/hooks/useWallet";
import { QUEUE_TIMEOUT_SECONDS } from "@/constants/config";
import type { Pool } from "@/types/types";
import type { Difficulty } from "@/types/components";
import type { GameCategory } from "@/types/types";
import { playPageHint, lobbyPlayNowButton } from "@/constants/messages";

export default function PlayPage() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { pools, loading: poolsLoading } = usePools();
    const { usdValue } = useWalletBalance();
    const { status, queuedPool, joinQueue, leaveQueue, resetStatus } =
        useMatchmaking();
    const [secondsLeft, setSecondsLeft] = useState(0);
    const gameId = searchParams.get("game_id");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmPool, setConfirmPool] = useState<Pool | null>(null);
    const [practiceOpen, setPracticeOpen] = useState(false);
    const [roomOpen, setRoomOpen] = useState(false);

    const {
        status: roomStatus,
        roomCode,
        expiresInSeconds,
        createRoom,
        joinRoom,
        cancelRoom,
        resetStatus: resetRoomStatus,
    } = useRoomMatch();

    useEffect(() => {
        if (status !== "queued" || !queuedPool) return;
        setSecondsLeft(QUEUE_TIMEOUT_SECONDS[queuedPool.category]);
        const interval = setInterval(() => {
            setSecondsLeft((s) => Math.max(s - 1, 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [status, queuedPool]);

    useEffect(() => {
        if (status !== "found") return;
        setSheetOpen(false);
        setConfirmOpen(false);
        if (!gameId) resetStatus();
    }, [status, gameId, resetStatus]);

    useEffect(() => {
        if (status === "idle") {
            setConfirmOpen(false);
            setConfirmPool(null);
        }
    }, [status]);

    useEffect(() => {
        if (roomStatus !== "found") return;
        setRoomOpen(false);
    }, [roomStatus]);

    if (gameId) {
        return <GameRoom />;
    }

    const handlePractice = (
        difficulty: Difficulty,
        timeControl: GameCategory,
    ) => {
        setPracticeOpen(false);
        const gameId = `pvc-${Date.now()}`;
        const color = Math.random() < 0.5 ? "white" : "black";
        try {
            sessionStorage.setItem(`pvc_color:${gameId}`, color);
        } catch {}
        navigate(
            `/play?mode=pvc&time=${timeControl}&difficulty=${difficulty}&game_id=${gameId}&color=${color}`,
            { replace: true },
        );
    };

    const handlePracticeOpen = () => {
        setSheetOpen(false);
        setPracticeOpen(true);
    };

    const handlePracticeCancel = () => {
        setPracticeOpen(false);
        setSheetOpen(true);
    };

    const handleRoomOpen = () => {
        setSheetOpen(false);
        resetRoomStatus();
        setRoomOpen(true);
    };

    const handleRoomClose = () => {
        if (roomStatus === "waiting") cancelRoom();
        setRoomOpen(false);
    };

    const handleRoomCancel = () => {
        cancelRoom();
        setRoomOpen(false);
        setSheetOpen(true);
    };

    const handlePoolPlay = (pool: Pool) => {
        setSheetOpen(false);
        setConfirmPool(pool);
        setConfirmOpen(true);
    };

    const handleConfirmJoin = () => {
        if (!confirmPool) return;
        joinQueue(confirmPool);
    };

    const handleConfirmCancel = () => {
        setConfirmOpen(false);
        setConfirmPool(null);
        setSheetOpen(true);
    };

    const handleConfirmDrawerClose = () => {
        if (status === "joining" || status === "queued") leaveQueue();
        setConfirmOpen(false);
        setConfirmPool(null);
    };

    return (
        <Box customClass="play-page">
            <Box customClass="play-body">
                <Box customClass="board-wrap">
                    <BoardPreview />
                </Box>
                <Text customClass="play-hint description">{playPageHint}</Text>
            </Box>

            <Box customClass="cta-bottom">
                <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    customClass="game-cta play-cta"
                    onClick={() => setSheetOpen(true)}
                >
                    {lobbyPlayNowButton}
                </Button>
            </Box>

            <StakeSheet
                open={sheetOpen}
                onClose={() => setSheetOpen(false)}
                pools={pools}
                poolsLoading={poolsLoading}
                usdValue={usdValue}
                onPoolPlay={handlePoolPlay}
                onPracticeOpen={handlePracticeOpen}
                onRoomOpen={handleRoomOpen}
                onInsufficientBalance={() => navigate("/wallet")}
            />

            <PracticeSheet
                open={practiceOpen}
                onClose={() => setPracticeOpen(false)}
                onCancel={handlePracticeCancel}
                onPlay={handlePractice}
            />

            <RoomSheet
                open={roomOpen}
                onClose={handleRoomClose}
                onCancel={handleRoomCancel}
                usdValue={usdValue}
                roomStatus={roomStatus}
                roomCode={roomCode}
                expiresInSeconds={expiresInSeconds}
                onCreateRoom={createRoom}
                onJoinRoom={joinRoom}
            />

            <PoolConfirmSheet
                open={confirmOpen}
                onClose={handleConfirmDrawerClose}
                status={status}
                queuedPool={queuedPool}
                confirmPool={confirmPool}
                secondsLeft={secondsLeft}
                onLeaveQueue={leaveQueue}
                onConfirmJoin={handleConfirmJoin}
                onConfirmCancel={handleConfirmCancel}
            />
        </Box>
    );
}
