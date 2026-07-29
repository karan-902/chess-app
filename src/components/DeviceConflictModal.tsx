import { motion } from "motion/react";
import { MonitorSmartphone } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import {
    authDeviceConflictTitle,
    authDeviceConflictDescription,
    authDeviceConflictContinueButton,
    authDeviceConflictCancelButton,
} from "@/components/messages";

interface IDeviceConflictModalProps {
    deviceName: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirming?: boolean;
}

function DeviceConflictModal({
    deviceName,
    onConfirm,
    onCancel,
    confirming,
}: IDeviceConflictModalProps) {
    return (
        <motion.div
            className="gsm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
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
                        {authDeviceConflictTitle}
                    </Text>
                </Box>

                <Box customClass="gsm-body">
                    <Box customClass="device-conflict-icon">
                        <MonitorSmartphone size={22} strokeWidth={2} />
                    </Box>
                    <Text customClass="device-conflict-desc">
                        {authDeviceConflictDescription(deviceName)}
                    </Text>
                </Box>

                <Box customClass="gsm-footer device-conflict-actions">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onCancel}
                        disabled={confirming}
                    >
                        {authDeviceConflictCancelButton}
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        isLoading={confirming}
                        onClick={onConfirm}
                    >
                        {authDeviceConflictContinueButton}
                    </Button>
                </Box>
            </motion.div>
        </motion.div>
    );
}

export default DeviceConflictModal;
