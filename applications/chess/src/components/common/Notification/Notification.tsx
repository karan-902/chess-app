import { Snackbar, Slide, Portal } from "@mui/material";
import classNames from "classnames";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { hideToast } from "@/redux/common/common.slice";
import AlertMessage from "@/components/base/AlertMessage/AlertMessage";

interface INotificationProps {
    customClass?: string;
}

export default function Notification({ customClass }: INotificationProps) {
    const dispatch = useReduxDispatch();
    const { open, severity, message, title } = useReduxSelector(
        (state) => state.common.toast,
    );
    const classes = classNames(customClass, "alert");

    const closeNotification = (
        _event?: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === "clickaway") return;
        dispatch(hideToast());
    };

    const rootEl = document.getElementById("root");

    return (
        <Portal container={rootEl}>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                autoHideDuration={1500}
                onClose={closeNotification}
                slots={{ transition: Slide }}
                slotProps={{
                    transition: { direction: "left", container: rootEl },
                }}
                sx={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    left: "auto",
                }}
            >
                <AlertMessage
                    message={message}
                    severity={severity}
                    variant="standard"
                    className={classes}
                >
                    {title && title}
                </AlertMessage>
            </Snackbar>
        </Portal>
    );
}
