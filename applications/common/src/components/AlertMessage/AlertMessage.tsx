import { Alert, type AlertColor, type AlertProps } from "@mui/material";
import classNames from "classnames";
import "./alert-message.scss";
import { forwardRef } from "react";
import {
 CheckCircleIcon,
 CircleAlert,
 ErrorIcon,
 WarningIcon,
 InfoIcon,
} from "@gopvp/common/src/components/images";

const iconsForAlert = {
 success: <CheckCircleIcon />,
 error: <ErrorIcon />,
 warning: <WarningIcon />,
 info: <InfoIcon />,
};

interface IAlertProps extends AlertProps {
 severity: AlertColor;
 message?: string;
 customClass?: string;
 inline?: boolean;
}

export const AlertMessage = forwardRef<HTMLDivElement, IAlertProps>(
 function AlertMessage({ customClass, message, inline, ...props }, ref) {
  return (
   <Alert
    {...props}
    ref={ref}
    iconMapping={iconsForAlert}
    icon={inline ? <CircleAlert strokeWidth={2.2} /> : props.icon}
    className={classNames(
     "common-alert-message",
     inline && "inline",
     customClass,
    )}
   >
    {message}
   </Alert>
  );
 },
);

export default AlertMessage;
