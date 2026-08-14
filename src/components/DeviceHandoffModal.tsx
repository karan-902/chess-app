import Modal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { useSocket } from "@/context/SocketContext";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { setDeviceHandoff } from "@/redux/socketModals.slice";
import { disconnectSocket } from "@/lib/socket";
import sessionService from "@/redux/sessionService";
import { router } from "@/routes/router";
import {
    deviceHandoffTitle,
    deviceHandoffBody,
    deviceHandoffBodyGeneric,
    deviceHandoffContinueButton,
    deviceHandoffStayButton,
} from "@/constants/messages";

export default function DeviceHandoffModal() {
    const { socket } = useSocket();
    const dispatch = useReduxDispatch();
    const deviceHandoff = useReduxSelector(
        (state) => state.socketModals.deviceHandoff,
    );

    if (!deviceHandoff) return null;

    const handleContinueHere = () => {
        socket?.emit("accept_device_handoff");
        dispatch(setDeviceHandoff(null));
    };

    const handleStayOnOther = async () => {
        dispatch(setDeviceHandoff(null));
        disconnectSocket();
        await sessionService.deleteSession();
        router.navigate("/login", { replace: true });
    };

    return (
        <Modal
            open
            preventOutsideClose
            title={deviceHandoffTitle}
            customClass="device-handoff-modal"
        >
            <Text customClass="modal-description">
                {deviceHandoff.deviceName
                    ? deviceHandoffBody(deviceHandoff.deviceName)
                    : deviceHandoffBodyGeneric}
            </Text>
            <Box customClass="modal-actions">
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleStayOnOther}
                >
                    {deviceHandoffStayButton}
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleContinueHere}
                >
                    {deviceHandoffContinueButton}
                </Button>
            </Box>
        </Modal>
    );
}
