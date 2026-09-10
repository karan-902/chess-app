import { useState } from "react";
import Modal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { useSocket } from "@/context/SocketContext";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { setActiveGame } from "@/redux/socketModals.slice";
import { formatAmount } from "@/utils/format";
import { shortenUsername } from "@/utils";
import { buildGameRoomUrl } from "@/utils";
import { router } from "@/routes/router";
import {
    rejoinGameTitle,
    rejoinGameBody,
    rejoinGameStakeLabel,
    rejoinGameOpponentLabel,
    rejoinGameRejoinButton,
    rejoinGameExitButton,
    rejoinGameForfeitTitle,
    rejoinGameForfeitBody,
    rejoinGameForfeitKeepPlayingButton,
    rejoinGameForfeitConfirmButton,
} from "@/constants/messages";

export default function RejoinGameModal() {
    const dispatch = useReduxDispatch();
    const { socket } = useSocket();
    const activeGame = useReduxSelector(
        (state) => state.socketModals.activeGame,
    );
    const deviceHandoff = useReduxSelector(
        (state) => state.socketModals.deviceHandoff,
    );
    const [confirmingExit, setConfirmingExit] = useState(false);

    if (!activeGame || deviceHandoff !== null) return null;

    const handleForfeit = () => {
        socket?.emit("resign_game", { game_id: activeGame.game_id });
        dispatch(setActiveGame(null));
    };

    const handleRejoin = () => {
        dispatch(setActiveGame(null));
        router.navigate(buildGameRoomUrl(activeGame), { replace: true });
    };

    return (
        <>
            <Modal
                open={!confirmingExit}
                preventOutsideClose
                title={rejoinGameTitle}
                customClass="rejoin-game-modal"
            >
                <Text customClass="modal-description">
                    {rejoinGameBody(
                        shortenUsername(activeGame.opponent.username),
                    )}
                </Text>
                <Box customClass="matches-stat-row">
                    <Text component="span" customClass="matches-stat-title">
                        {rejoinGameOpponentLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {shortenUsername(activeGame.opponent.username)} (
                        {activeGame.opponent.elo_rating})
                    </Text>
                </Box>
                <Box customClass="matches-stat-row">
                    <Text component="span" customClass="matches-stat-title">
                        {rejoinGameStakeLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {formatAmount(activeGame.stake_amount)}
                    </Text>
                </Box>
                <Box customClass="modal-actions">
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setConfirmingExit(true)}
                    >
                        {rejoinGameExitButton}
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleRejoin}
                    >
                        {rejoinGameRejoinButton}
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={confirmingExit}
                preventOutsideClose
                title={rejoinGameForfeitTitle}
                customClass="rejoin-game-modal modal--danger"
            >
                <Text customClass="modal-description">
                    {rejoinGameForfeitBody(
                        formatAmount(activeGame.stake_amount),
                    )}
                </Text>
                <Box customClass="modal-actions">
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setConfirmingExit(false)}
                    >
                        {rejoinGameForfeitKeepPlayingButton}
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleForfeit}
                    >
                        {rejoinGameForfeitConfirmButton}
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
