import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import SuccessCheckmark from "@gopvp/common/src/components/SuccessCheckmark/SuccessCheckmark";
import { formatAmount } from "@gopvp/common/src/util/format";
import type { IWalletSuccessStageProps } from "@gopvp/app/src/types/component";

export default function WalletSuccessStage({
 amountUsd,
 title,
 isProcessing = false,
}: IWalletSuccessStageProps) {
 return (
  <Box customClass="modal-success-stage">
   <Box customClass="modal-success-icon">
    {isProcessing ? (
     <Box customClass="logo-loader" role="progressbar" />
    ) : (
     <SuccessCheckmark />
    )}
   </Box>
   <Box customClass="deposit-success-amountWrapper">
    <Text customClass="modal-success-amount">{formatAmount(amountUsd)}</Text>
    <Text customClass="modal-heading value-heading">{title}</Text>
   </Box>
  </Box>
 );
}
