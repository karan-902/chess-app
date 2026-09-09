import { Alert, type AlertProps } from "@mui/material";
import classNames from "classnames";
import "./alert.scss";
import { forwardRef } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

export const iconsForAlert = {
    success: <CheckCircleIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />,
};

interface IAlertProps extends AlertProps {
    severity: "error" | "warning" | "success" | "info";
    message?: string;
    customClass?: string;
}

const AlertMessage = forwardRef<HTMLDivElement, IAlertProps>(function AlertMsg(
    { customClass, severity, message, ...props },
    ref,
) {
    const classes = classNames(`${customClass} alert`);

    let icon;
    switch (severity) {
        case "error":
            icon = iconsForAlert.error;
            break;
        case "info":
            icon = iconsForAlert.info;
            break;
        case "success":
            icon = iconsForAlert.success;
            break;
        case "warning":
            icon = iconsForAlert.warning;
            break;
        default:
            break;
    }

    return (
        <Alert
            {...props}
            ref={ref}
            severity={severity}
            variant="standard"
            icon={icon}
            className={classes}
        >
            {message}
        </Alert>
    );
});

export default AlertMessage;
