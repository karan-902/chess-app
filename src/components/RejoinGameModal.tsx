import Modal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { setActiveGame } from "@/redux/socketModals.slice";
import { formateAmount } from "@/utils/formate";
import { secondsToTimeControl } from "@/types/components";
import { router } from "@/routes/router";
import {
    rejoinGameTitle,
    rejoinGameBody,
    rejoinGameStakeLabel,
    rejoinGameOpponentLabel,
    rejoinGameRejoinButton,
    rejoinGameExitButton,
} from "@/constants/messages";

export default function RejoinGameModal() {
    const dispatch = useReduxDispatch();
    const activeGame = useReduxSelector(
        (state) => state.socketModals.activeGame,
    );
    const deviceHandoff = useReduxSelector(
        (state) => state.socketModals.deviceHandoff,
    );

    if (!activeGame || deviceHandoff !== null) return null;

    const handleExit = () => dispatch(setActiveGame(null));

    const handleRejoin = () => {
        const url =
            `/play?mode=pvp&time=${secondsToTimeControl(activeGame.time_seconds)}` +
            `&game_id=${activeGame.game_id}&color=${activeGame.your_color}` +
            `&opponent=${encodeURIComponent(activeGame.opponent.username)}` +
            `&opp_rating=${activeGame.opponent.elo_rating}&opp_id=${activeGame.opponent.id}` +
            `&opp_avatar_seed=${encodeURIComponent(activeGame.opponent.avatar_seed ?? "")}` +
            `&stake_amount=${activeGame.stake_amount}`;
        dispatch(setActiveGame(null));
        router.navigate(url, { replace: true });
    };

    return (
        <Modal
            open
            preventOutsideClose
            title={rejoinGameTitle}
            customClass="rejoin-game-modal"
        >
            <Text customClass="modal-description">
                {rejoinGameBody(activeGame.opponent.username)}
            </Text>
            <Box customClass="matches-stat-row">
                <Text component="span" customClass="matches-stat-title">
                    {rejoinGameOpponentLabel}
                </Text>
                <Text component="span" customClass="matches-stat-val">
                    {activeGame.opponent.username} (
                    {activeGame.opponent.elo_rating})
                </Text>
            </Box>
            <Box customClass="matches-stat-row">
                <Text component="span" customClass="matches-stat-title">
                    {rejoinGameStakeLabel}
                </Text>
                <Text component="span" customClass="matches-stat-val">
                    {formateAmount(activeGame.stake_amount)}
                </Text>
            </Box>
            <Box customClass="modal-actions">
                <Button variant="outlined" fullWidth onClick={handleExit}>
                    {rejoinGameExitButton}
                </Button>
                <Button variant="contained" fullWidth onClick={handleRejoin}>
                    {rejoinGameRejoinButton}
                </Button>
            </Box>
        </Modal>
    );
}
