import { motion } from "motion/react";
import { MonitorSmartphone } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import {
    deviceHandoffTitle,
    deviceHandoffBody,
    deviceHandoffBodyGeneric,
    deviceHandoffContinueButton,
    deviceHandoffStayButton,
} from "@/components/messages";

interface IDeviceHandoffModalProps {
    deviceName: string | null;
    onContinueHere: () => void;
    onStayOnOther: () => void;
}

function DeviceHandoffModal({
    deviceName,
    onContinueHere,
    onStayOnOther,
}: IDeviceHandoffModalProps) {
    return (
        <motion.div
            className="gsm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onStayOnOther}
        >
            <motion.div
                className="gsm-panel"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box customClass="gsm-header">
                    <Text as="span" customClass="gsm-modal-title">
                        {deviceHandoffTitle}
                    </Text>
                </Box>

                <Box customClass="gsm-body">
                    <Box customClass="device-conflict-icon">
                        <MonitorSmartphone size={22} strokeWidth={2} />
                    </Box>
                    <Text customClass="device-conflict-desc">
                        {deviceName
                            ? deviceHandoffBody(deviceName)
                            : deviceHandoffBodyGeneric}
                    </Text>
                </Box>

                <Box customClass="gsm-footer device-conflict-actions">
                    <Button variant="outline" fullWidth onClick={onStayOnOther}>
                        {deviceHandoffStayButton}
                    </Button>
                    <Button variant="primary" fullWidth onClick={onContinueHere}>
                        {deviceHandoffContinueButton}
                    </Button>
                </Box>
            </motion.div>
        </motion.div>
    );
}

export default DeviceHandoffModal;
