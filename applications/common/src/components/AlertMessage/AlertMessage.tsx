import { forwardRef } from "react";
import { Alert } from "@mui/material";
import type { AlertProps } from "@mui/material";
import classNames from "classnames";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import "./alert.scss";

interface IAlertMessageProps extends AlertProps {
    severity: "error" | "warning" | "success" | "info";
    message?: string;
    customClass?: string;
}

const iconsForAlert = {
    success: <CheckCircle2 size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
};

const AlertMessage = forwardRef<HTMLDivElement, IAlertMessageProps>(
    function AlertMessage({ customClass, severity, message, ...props }, ref) {
        const classes = classNames("alert", customClass);

        return (
            <Alert
                {...props}
                ref={ref}
                severity={severity}
                variant="standard"
                icon={iconsForAlert[severity]}
                className={classes}
            >
                {message}
            </Alert>
        );
    },
);

export default AlertMessage;
