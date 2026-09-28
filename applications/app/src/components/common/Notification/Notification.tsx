import { forwardRef, type ReactElement } from "react";
import { Snackbar, Slide, Portal } from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import classNames from "classnames";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { hideToast } from "@gopvp/app/src/redux/common/slice";
import AlertMessage from "@gopvp/common/src/components/AlertMessage/AlertMessage";
import type { INotificationProps } from "@gopvp/app/src/types/component";

const SlideLeft = forwardRef<
 unknown,
 TransitionProps & { children: ReactElement }
>((props, ref) => (
 <Slide
  ref={ref}
  {...props}
  direction="left"
  container={document.getElementById("root")}
 />
));

export default function Notification({ customClass }: INotificationProps) {
 const dispatch = useReduxDispatch();
 const { isToastOpen, toastVariant, toastMessage, toastTitle } =
  useReduxSelector((state) => state.common.toast);
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
    open={isToastOpen}
    autoHideDuration={1500}
    onClose={closeNotification}
    slots={{ transition: SlideLeft }}
    sx={{
     position: "absolute",
     top: "1rem",
     right: "1rem",
     left: "auto",
    }}
   >
    <AlertMessage
     message={toastMessage}
     severity={toastVariant}
     variant="standard"
     className={classes}
    >
     {toastTitle && toastTitle}
    </AlertMessage>
   </Snackbar>
  </Portal>
 );
}
