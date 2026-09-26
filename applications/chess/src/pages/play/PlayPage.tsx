import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import BoardPreview from "@/components/board/BoardPreview";
import GameRoom from "./GameRoom";
import BetSheet from "./BetSheet";
import PracticeSheet from "./PracticeSheet";
import RoomSheet from "./RoomSheet";
import PoolConfirmSheet from "./PoolConfirmSheet";
import { usePools } from "@/hooks/usePools";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useRoomMatch } from "@/hooks/useRoomMatch";
import { useWalletBalance } from "@/hooks/useWallet";
import { POOL_TIMEOUT_SECONDS } from "@/constants/config";
import { useGame } from "@/hooks/useGame";
import type { IPoolResponse } from "@/types/types";
import type { Difficulty } from "@/types/components";
import type { GameCategory } from "@/types/types";
import {
 tapPlayNowHintText,
 playNowText,
} from "@/constants/messages";

export default function PlayPage() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { routes } = useGame();
    const { pools, loading: poolsLoading } = usePools();
    const { usdValue } = useWalletBalance();
    const { status, queuedPool, joinQueue, leaveQueue, resetStatus } =
        useMatchmaking();
    const [secondsLeft, setSecondsLeft] = useState(0);
    const gameId = searchParams.get("game_id");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmPool, setConfirmPool] = useState<IPoolResponse | null>(null);
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
    } = useRoomMatch(() => {
        setRoomOpen(false);
        navigate(routes.PLAY, { replace: true });
    });

    useEffect(() => {
        if (status !== "queued" || !queuedPool) return;
        setSecondsLeft(POOL_TIMEOUT_SECONDS);
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
            `${routes.PLAY}?mode=pvc&time=${timeControl}&difficulty=${difficulty}&game_id=${gameId}&color=${color}`,
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

    const handlePoolPlay = (pool: IPoolResponse) => {
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

    const handleConfirmClose = () => {
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
                <Text customClass="play-hint description">{tapPlayNowHintText}</Text>
            </Box>

            <Box customClass="cta-bottom">
                <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    customClass="game-cta play-cta"
                    onClick={() => setSheetOpen(true)}
                >
                    {playNowText}
                </Button>
            </Box>

            <BetSheet
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
                onClose={handleConfirmClose}
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
