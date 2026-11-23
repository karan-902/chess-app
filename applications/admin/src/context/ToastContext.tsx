import {
 createContext,
 useContext,
 useState,
 type CSSProperties,
 type PropsWithChildren,
} from "react";
import { Snackbar } from "@mui/material";
import AlertMessage from "@gopvp/common/src/components/AlertMessage/AlertMessage";
import { ADMIN_TOAST_AUTO_HIDE_MS } from "@gopvp/admin/src/constants/limit";
import type { IToast } from "@gopvp/common/src/types/component";

type TShowToast = (toast: IToast) => void;

const ToastContext = createContext<TShowToast | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
 const [toast, setToast] = useState<IToast | null>(null);
 const closeToast = () => setToast(null);

 return (
  <ToastContext.Provider value={setToast}>
   {children}
   <Snackbar
    open={!!toast}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    autoHideDuration={ADMIN_TOAST_AUTO_HIDE_MS}
    onClose={(_event, reason) => reason !== "clickaway" && closeToast()}
   >
    <AlertMessage
     key={toast?.toastMessage}
     style={
      { "--toast-duration": `${ADMIN_TOAST_AUTO_HIDE_MS}ms` } as CSSProperties
     }
     message={toast?.toastMessage}
     severity={toast?.toastVariant ?? "error"}
     variant="standard"
     className="alert"
     customClass="toast"
     onClose={closeToast}
    />
   </Snackbar>
  </ToastContext.Provider>
 );
}

export function useToast() {
 const ctx = useContext(ToastContext);
 if (!ctx) {
  throw new Error("useToast must be used within a ToastProvider");
 }
 return ctx;
}
