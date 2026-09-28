import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
import type { ISheetActionsProps } from "@gopvp/common/src/types/component";

export default function SheetActions({
 children,
 cancelLabel,
 onCancel,
 isCancelDisabled = false,
}: ISheetActionsProps) {
 return (
  <Box customClass="pool-confirm-actions">
   {children}
   {cancelLabel && (
    <Button
     type="button"
     variant="outlined"
     fullWidth
     customClass="pool-confirm-cancel-btn"
     disabled={isCancelDisabled}
     onClick={onCancel}
    >
     {cancelLabel}
    </Button>
   )}
  </Box>
 );
}
