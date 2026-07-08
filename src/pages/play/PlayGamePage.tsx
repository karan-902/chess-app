import { useState } from "react";
import clsx from "clsx";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import GameOverScreen from "./GameOverScreen";
import WagerBadge from "./WagerBadge";
import PlayerRow from "./PlayerRow";
import EvalBar from "./EvalBar";
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import EnginePanel from "./EnginePanel";
import ActionButtons from "./ActionButtons";
import MoveHistory from "./MoveHistory";
import ChatPanel from "./ChatPanel";
import {
    type Difficulty,
    type GameMode,
    type TimeControl,
    DIFFICULTY_CONFIG,
} from "@/types/components";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import { useGameClock } from "@/hooks/useGameClock";
import { useBoardReview } from "@/hooks/useBoardReview";
import { useComputerOpponent } from "@/hooks/useComputerOpponent";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { fenToBoard } from "@/utils/fenToBoard";
import { useReduxSelector } from "@/store/hooks";

interface IPlayViewProps {
    mode: GameMode;
    difficulty: Difficulty;
    timeControl: TimeControl;
    playerColor?: "white" | "black";
    opponentName?: string;
    opponentRating?: number;
    onNewGame: () => void;
}

type GameResult = "win" | "lose" | "draw";

function getGameOverInfo(
    inactiveOut: boolean,
    resigned: boolean,
    drawClaimed: boolean,
    timedOut: "w" | "b" | null,
    isCheckmate: boolean,
    isStalemate: boolean,
    turn: "w" | "b",
    playerSide: "w" | "b",
): { result: GameResult; reason: string } {
    if (inactiveOut) return { result: "lose", reason: "Inactivity" };
    if (resigned) return { result: "lose", reason: "Resignation" };
    if (drawClaimed) return { result: "draw", reason: "Agreement" };
    if (timedOut === playerSide) return { result: "lose", reason: "Timeout" };
    if (timedOut && timedOut !== playerSide) return { result: "win", reason: "Timeout" };
    if (isCheckmate)
        return { result: turn === playerSide ? "lose" : "win", reason: "Checkmate" };
    if (isStalemate) return { result: "draw", reason: "Stalemate" };
    return { result: "draw", reason: "Draw" };
}

export default function PlayGamePage({
    mode,
    difficulty,
    timeControl,
    playerColor,
    opponentName: opponentNameProp,
    opponentRating: opponentRatingProp,
    onNewGame,
}: IPlayViewProps) {
    const session = useReduxSelector((s) => s.auth.session);
    const userName = session
        ? `${session.first_name} ${session.last_name}`.trim()
        : "You";
    const userLetter = session?.first_name?.[0]?.toUpperCase() ?? "?";

    // playerSide: "w" for pvc (always white) or when color=white; "b" when color=black
    const playerSide: "w" | "b" = playerColor === "black" ? "b" : "w";
    const boardFlipped = playerSide === "b";

    // ── Chess engine ──────────────────────────────────────────────────────────
    const game = useChessGame();
    const config = DIFFICULTY_CONFIG[difficulty];

    const { bestMove } = useStockfish(
        game.fen,
        config.depth,
        mode === "pvc" && game.turn === "b" && difficulty !== "easy",
        config.elo,
    );

    // ── Board interaction state ───────────────────────────────────────────────
    const [from, setFrom] = useState<string | null>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);
    const [flashSquare, setFlashSquare] = useState<string | null>(null);
    const [resigned, setResigned] = useState(false);
    const [drawClaimed, setDrawClaimed] = useState(false);
    const [panelTab, setPanelTab] = useState<"moves" | "chat">("moves");

    // ── Game-end hooks ────────────────────────────────────────────────────────
    const baseEnded = game.isGameOver || resigned || drawClaimed;
    const clock = useGameClock(timeControl, baseEnded, game.turn);
    const inactivity = useInactivityTimeout(
        baseEnded || !!clock.timedOut,
        game.turn,
        game.fenHistory.length,
        playerSide,
    );
    const gameEnded = baseEnded || !!clock.timedOut || inactivity.inactiveOut;

    // ── Computer opponent ─────────────────────────────────────────────────────
    const review = useBoardReview(game.fenHistory);
    useComputerOpponent({
        mode,
        difficulty,
        fen: game.fen,
        turn: game.turn,
        gameEnded,
        bestMove,
        makeMove: game.makeMove,
        getRandomMove: game.getRandomMove,
    });

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSquareClick = (square: string) => {
        if (gameEnded || review.isReviewing) return;
        // pvc: only white moves; pvp with explicit color: only player's side moves
        if (mode === "pvc" && game.turn === "b") return;
        if (mode === "pvp" && playerColor && game.turn !== playerSide) return;

        if (!from) {
            const moves = game.getLegalMoves(square);
            if (moves.length > 0) {
                setFrom(square);
                setLegalMoves(moves);
            } else {
                setFlashSquare(square);
                setTimeout(() => setFlashSquare(null), 500);
            }
        } else if (from === square) {
            setFrom(null);
            setLegalMoves([]);
        } else if (legalMoves.includes(square)) {
            game.makeMove(from, square);
            setFrom(null);
            setLegalMoves([]);
        } else {
            const moves = game.getLegalMoves(square);
            if (moves.length > 0) {
                setFrom(square);
                setLegalMoves(moves);
            } else {
                setFlashSquare(square);
                setTimeout(() => setFlashSquare(null), 500);
            }
        }
    };

    const handleNewGame = () => {
        game.resetGame();
        setFrom(null);
        setLegalMoves([]);
        setFlashSquare(null);
        setResigned(false);
        setDrawClaimed(false);
        clock.reset();
        inactivity.reset();
        onNewGame();
    };

    // ── Derived values ────────────────────────────────────────────────────────
    const oppSide: "w" | "b" = playerSide === "w" ? "b" : "w";
    const resolvedOpponentName =
        opponentNameProp ?? (mode === "pvc" ? "Computer" : "Opponent");
    const resolvedOpponentRating =
        opponentRatingProp ?? (mode === "pvc" ? config.rating : 1200);
    const opponentLetter = resolvedOpponentName[0]?.toUpperCase() ?? "?";
    const computerTurn = mode === "pvc" && game.turn === "b" && !gameEnded;

    // Assign timers: player always gets their side's clock
    const playerTimer = playerSide === "w" ? clock.whiteTimer : clock.blackTimer;
    const opponentTimer = oppSide === "w" ? clock.whiteTimer : clock.blackTimer;
    const playerTimerActive = !gameEnded && game.turn === playerSide && !computerTurn;
    const opponentTimerActive = !gameEnded && game.turn === oppSide;

    const board = fenToBoard(review.displayFen);
    const attackedSquares = game.getAttackedSquares();
    const checkSquare = game.inCheck ? game.kingSquare() : null;
    const stalemateSquare = game.isStalemate ? game.kingSquare() : null;

    const { result: gameOverResult, reason: gameOverReason } = getGameOverInfo(
        inactivity.inactiveOut,
        resigned,
        drawClaimed,
        clock.timedOut,
        game.isCheckmate,
        game.isStalemate,
        game.turn,
        playerSide,
    );
    const lastRecord = game.moveHistory[game.moveHistory.length - 1];
    const totalMoves =
        game.moveHistory.length * 2 - (lastRecord?.b === "" ? 1 : 0);

    // ── Shared sub-trees (rendered in both mobile and desktop layouts) ────────
    const opponentRow = (
        <PlayerRow
            name={resolvedOpponentName}
            rating={resolvedOpponentRating}
            letter={opponentLetter}
            variant="danger"
            timer={opponentTimer}
            timerActive={opponentTimerActive}
            isThinking={computerTurn}
        />
    );
    const playerRow = (
        <PlayerRow
            name={userName}
            rating={2534}
            letter={userLetter}
            variant="primary"
            timer={playerTimer}
            timerActive={playerTimerActive}
            inactivityWarning={inactivity.secsLeft}
        />
    );
    const actionButtons = (
        <ActionButtons
            onNewGame={handleNewGame}
            onResign={() => {
                if (!gameEnded) setResigned(true);
            }}
            onDraw={() => {
                if (!gameEnded) setDrawClaimed(true);
            }}
            disabled={gameEnded}
        />
    );
    const panel = (
        <>
            {mode === "pvp" && (
                <Box customClass="game-tabs">
                    {(["moves", "chat"] as const).map((tab) => (
                        <button
                            key={tab}
                            className={clsx("game-tab", panelTab === tab && "active")}
                            onClick={() => setPanelTab(tab)}
                        >
                            <Text as="span" customClass="game-tab-label">{tab}</Text>
                        </button>
                    ))}
                </Box>
            )}
            {panelTab === "chat" ? (
                <ChatPanel />
            ) : (
                <MoveHistory
                    moves={game.moveHistory}
                    fenHistory={game.fenHistory}
                    viewIndex={review.viewIndex}
                    onGoBack={review.goBack}
                    onGoForward={review.goForward}
                    onJumpTo={review.jumpTo}
                />
            )}
        </>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Box customClass="play-view">
            {gameEnded && (
                <GameOverScreen
                    result={gameOverResult}
                    reason={gameOverReason}
                    opponentName={resolvedOpponentName}
                    opponentRating={resolvedOpponentRating}
                    totalMoves={totalMoves}
                    elapsedTime={clock.elapsedFormatted}
                    onNewGame={handleNewGame}
                    onClose={onNewGame}
                />
            )}

            {/* Mobile top bar */}
            <Box customClass="play-top-bar">
                <WagerBadge mode={mode} difficulty={difficulty} />
                {opponentRow}
            </Box>

            {/* Main layout: board + side panel */}
            <Box customClass="play-main">
                <Box customClass="play-board-col">
                    <EvalBar evalPct={57} />
                    <ChessBoard
                        board={board}
                        selectedSquare={from}
                        legalMoves={legalMoves}
                        attackedSquares={attackedSquares}
                        checkSquare={checkSquare}
                        stalemateSquare={stalemateSquare}
                        flashSquare={flashSquare}
                        onSquareClick={handleSquareClick}
                        lastMove={game.lastMove}
                        flipped={boardFlipped}
                    />
                </Box>
                <Box customClass="play-panel-col">
                    <WagerBadge mode={mode} difficulty={difficulty} />
                    {opponentRow}
                    {mode === "pvc" && <EnginePanel />}
                    {playerRow}
                    {actionButtons}
                    {panel}
                </Box>
            </Box>

            {/* Mobile bottom bar */}
            <Box customClass="play-bottom-bar">
                {mode === "pvc" && <EnginePanel />}
                {playerRow}
                {actionButtons}
                {panel}
            </Box>
        </Box>
    );
}
