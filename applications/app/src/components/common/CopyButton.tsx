import CustomTooltip from "@gopvp/common/src/components/Tooltip/Tooltip";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import Button from "@gopvp/common/src/components/Button/Button";
import { useCopyToClipboard } from "@gopvp/app/src/hooks/useCopyToClipboard";
import { copyText, copiedText } from "@gopvp/app/src/constants/message";
import type { ICopyButtonProps } from "@gopvp/app/src/types/component";

export default function CopyButton({ text, showLabel = false }: ICopyButtonProps) {
 const { copied, copy } = useCopyToClipboard();

 return (
  <CustomTooltip open={copied} title={copiedText} placement="top" arrow>
   {showLabel ? (
    <Button
     type="button"
     startIcon="copy"
     customClass="copy-label-btn"
     onClick={() => copy(text)}
    >
     {copyText}
    </Button>
   ) : (
    <CustomIconButton
     type="button"
     icon="copy"
     customClass="result-copy-btn"
     aria-label={copyText}
     onClick={() => copy(text)}
    />
   )}
  </CustomTooltip>
 );
}
