import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Box from "@gopvp/common/src/components/Box/Box";
import { useSheetReady } from "@gopvp/app/src/hooks/useSheetReady";
import {
 WALLET_SUCCESS_CLOSE_MS,
 WALLET_LOADER_SIZE,
} from "@gopvp/app/src/constants/limit";
import type { IWalletSheetShellProps } from "@gopvp/app/src/types/component";

export default function WalletSheetShell({
 open,
 isSuccess,
 onClose,
 children,
}: IWalletSheetShellProps) {
 const ready = useSheetReady(open);

 useEffect(() => {
  if (!isSuccess) return;
  const timer = setTimeout(onClose, WALLET_SUCCESS_CLOSE_MS);
  return () => clearTimeout(timer);
 }, [isSuccess, onClose]);

 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   hideCloseIcon={isSuccess}
   disableRestoreFocus
   customClass="wallet-sheet"
  >
   {ready ? (
    children
   ) : (
    <Box customClass="modal-loader">
     <CircularProgress size={WALLET_LOADER_SIZE} />
    </Box>
   )}
  </CustomDrawer>
 );
}
