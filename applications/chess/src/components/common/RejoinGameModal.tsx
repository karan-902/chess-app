import { useState } from "react";
import CustomModal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { useSocket } from "@/context/SocketContext";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { setActiveGame } from "@/redux/socketModals/slice";
import { formatAmount } from "@/utils/format";
import { shortenUsername } from "@/utils";
import { buildGameRoomUrl } from "@/utils";
import { navigateTo } from "@gopvp/common/src/util/navigationService";
import {
 rejoinMatchText,
 matchStillLiveText,
 feeText,
 opponentText,
 rejoinNowText,
 exitText,
 forfeitGameText,
 leavingForfeitsText,
 keepPlayingText,
 forfeitAndExitText,
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
    const enteredGame = useReduxSelector((state) => state.speed.enteredGame);
    const [confirmingExit, setConfirmingExit] = useState(false);

    if (!activeGame || deviceHandoff !== null) return null;

    const handleForfeit = () => {
        socket?.emit("resign_game", { game_id: activeGame.game_id });
        dispatch(setActiveGame(null));
    };

    const handleRejoin = () => {
        dispatch(setActiveGame(null));
        if (enteredGame) {
            navigateTo(buildGameRoomUrl(activeGame, enteredGame), { replace: true });
        }
    };

    return (
        <>
            <CustomModal
                open={!confirmingExit}
                preventOutsideClose
                title={rejoinMatchText}
                customClass="rejoin-game-modal"
            >
                <Text customClass="modal-description">
                    {matchStillLiveText(
                        shortenUsername(activeGame.opponent.username),
                    )}
                </Text>
                <Box customClass="stat-row">
                    <Text component="span" customClass="stat-title">
                        {opponentText}
                    </Text>
                    <Text component="span" customClass="stat-val">
                        {shortenUsername(activeGame.opponent.username)} (
                        {activeGame.opponent.elo_rating})
                    </Text>
                </Box>
                <Box customClass="stat-row">
                    <Text component="span" customClass="stat-title">
                        {feeText}
                    </Text>
                    <Text component="span" customClass="stat-val">
                        {formatAmount(activeGame.stake_amount)}
                    </Text>
                </Box>
                <Box customClass="modal-actions">
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setConfirmingExit(true)}
                    >
                        {exitText}
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleRejoin}
                    >
                        {rejoinNowText}
                    </Button>
                </Box>
            </CustomModal>
            <CustomModal
                open={confirmingExit}
                preventOutsideClose
                title={forfeitGameText}
                customClass="rejoin-game-modal"
            >
                <Text customClass="modal-description">
                    {leavingForfeitsText(
                        formatAmount(activeGame.stake_amount),
                    )}
                </Text>
                <Box customClass="modal-actions">
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setConfirmingExit(false)}
                    >
                        {keepPlayingText}
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleForfeit}
                    >
                        {forfeitAndExitText}
                    </Button>
                </Box>
            </CustomModal>
        </>
    );
}
