import { useEffect } from "react";
import classNames from "classnames";
import { CircularProgress } from "@mui/material";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import Box from "@gopvp/common/src/components/Box/Box";
import { useModalReady } from "@gopvp/app/src/hooks/useModalReady";
import { WALLET_SUCCESS_CLOSE_MS } from "@gopvp/app/src/constants/limit";
import type { IWalletModalShellProps } from "@gopvp/app/src/types/component";

export default function WalletModalShell({
 open,
 isSuccess,
 onClose,
 children,
}: IWalletModalShellProps) {
 const ready = useModalReady(open);

 useEffect(() => {
  if (!isSuccess) return;
  const timer = setTimeout(onClose, WALLET_SUCCESS_CLOSE_MS);
  return () => clearTimeout(timer);
 }, [isSuccess, onClose]);

 return (
  <CustomModal
   open={open}
   onClose={onClose}
   hideCloseIcon={isSuccess}
   disableRestoreFocus
   customClass={classNames("wallet-modal", isSuccess && "wallet-modal-success")}
  >
   {ready ? (
    children
   ) : (
    <Box customClass="modal-loader">
     <CircularProgress size={28} />
    </Box>
   )}
  </CustomModal>
 );
}
