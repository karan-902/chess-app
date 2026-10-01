import { Alert, type AlertColor, type AlertProps } from "@mui/material";
import classNames from "classnames";
import "./alert-message.scss";
import { forwardRef } from "react";
import {
 CheckCircleIcon,
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
}

export const AlertMessage = forwardRef<HTMLDivElement, IAlertProps>(
 function AlertMessage({ customClass, message, ...props }, ref) {
  return (
   <Alert
    {...props}
    ref={ref}
    iconMapping={iconsForAlert}
    className={classNames("common-alert-message", customClass)}
   >
    {message}
   </Alert>
  );
 },
);

export default AlertMessage;
