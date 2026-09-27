import { useState } from "react";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { useReduxSelector, useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { setActiveGame } from "@gopvp/app/src/redux/socketModals/slice";
import { showAckErrorToast } from "@gopvp/common/src/util/api";
import { formatAmount, shortenUsername } from "@gopvp/common/src/util/format";
import { buildMatchUrl, isGameSlug } from "@gopvp/app/src/utils";
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
 forfeitAndExitText,
} from "@gopvp/app/src/constants/messages";
import { keepPlayingText } from "@gopvp/common/src/constants/messages";

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

    if (!activeGame || deviceHandoff !== null) {
        return null;
    }

    const { opponent } = activeGame;
    const opponentName = shortenUsername(opponent.username);
    const betAmount = formatAmount(activeGame.bet);

    const handleForfeit = () => {
        socket?.emit("game:rejoin:declined", showAckErrorToast);
        setConfirmingExit(false);
        dispatch(setActiveGame(null));
    };

    const handleRejoin = () => {
        dispatch(setActiveGame(null));
        if (isGameSlug(activeGame.game_slug)) {
            navigateTo(buildMatchUrl(activeGame.game_slug, activeGame.match_id), {
                replace: true,
            });
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
                    {matchStillLiveText(opponentName)}
                </Text>
                <Box customClass="stat-row">
                    <Text component="span" customClass="stat-title">
                        {opponentText}
                    </Text>
                    <Text component="span" customClass="stat-val">
                        {opponentName} ({Math.round(opponent.score)})
                    </Text>
                </Box>
                <Box customClass="stat-row">
                    <Text component="span" customClass="stat-title">
                        {feeText}
                    </Text>
                    <Text component="span" customClass="stat-val">
                        {betAmount}
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
                    {leavingForfeitsText(betAmount)}
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
