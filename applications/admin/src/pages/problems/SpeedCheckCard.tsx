import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import { RefreshCw05 } from "@gopvp/common/src/components/images";
import { formatTime } from "@gopvp/common/src/util/format";
import { ADMIN_ENDPOINTS } from "@gopvp/admin/src/constants/endpoint";
import { RECORD_STATUS_TONES } from "@gopvp/admin/src/constants/mapper";
import {
 checkOnSpeedHintText,
 checkOnSpeedText,
 checkedAtText,
 noSpeedCheckText,
 notSentToSpeedText,
 ourStatusText,
 speedStatusText,
 speedUnreachableText,
} from "@gopvp/admin/src/constants/message";
import { adminApiCall } from "@gopvp/admin/src/utils/api";
import {
 getRecordStatusLabel,
 isSpeedStatusMismatch,
} from "@gopvp/admin/src/utils/status";
import ErrorNotice from "@gopvp/admin/src/components/ErrorNotice";
import FieldList from "@gopvp/admin/src/components/FieldList";
import type {
 TAdminField,
 TAdminSpeedCheckCardProps,
 TAdminSpeedStatus,
 TAdminSpeedStatusBody,
} from "@gopvp/admin/src/types";

export default function SpeedCheckCard({ body }: TAdminSpeedCheckCardProps) {
 const [result, setResult] = useState<TAdminSpeedStatus | null>(null);
 const [checkedAt, setCheckedAt] = useState(0);
 const [isChecking, setIsChecking] = useState(false);
 const [error, setError] = useState("");

 const handleCheck = async () => {
  if (!body || isChecking) return;
  setIsChecking(true);
  setError("");
  try {
   const response = await adminApiCall<
    TAdminSpeedStatus,
    TAdminSpeedStatusBody
   >("POST", ADMIN_ENDPOINTS.SPEED_STATUS, body);
   setResult(response);
   setCheckedAt(Date.now());
  } catch (requestError) {
   console.error(requestError);
   setError(speedUnreachableText);
  } finally {
   setIsChecking(false);
  }
 };

 const ourRecord = result?.record;
 const speed = result?.speed;
 const fields: TAdminField[] = result
  ? [
     ...(ourRecord
      ? [
         {
          label: ourStatusText,
          value: getRecordStatusLabel(ourRecord),
          isChip: true,
          chipTone: RECORD_STATUS_TONES[ourRecord.status],
         },
        ]
      : []),
     speed
      ? {
         label: speedStatusText,
         value: speed.status,
         sub: checkedAtText(formatTime(checkedAt)),
         tone:
          ourRecord && isSpeedStatusMismatch(ourRecord.status, speed.status)
           ? "danger"
           : undefined,
        }
      : { label: speedStatusText, value: notSentToSpeedText },
    ]
  : [];

 return (
  <Card customClass="admin-detail">
   <Box customClass="admin-detail-head">
    <Box customClass="admin-stat-icon">
     <RefreshCw05 size={18} aria-hidden />
    </Box>
    <Text component="h2" customClass="admin-section-title">
     {checkOnSpeedText}
    </Text>
   </Box>
   <Text customClass="admin-page-hint">
    {body ? checkOnSpeedHintText : noSpeedCheckText}
   </Text>
   {error && <ErrorNotice message={error} />}
   {result && <FieldList fields={fields} />}
   {body && (
    <Button
     customClass="admin-btn secondary"
     isLoading={isChecking}
     onClick={handleCheck}
    >
     <RefreshCw05 size={16} aria-hidden />
     {checkOnSpeedText}
    </Button>
   )}
  </Card>
 );
}
