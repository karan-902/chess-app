import dayjs from "dayjs";
import { formatText } from "@gopvp/common/src/util/format";
import {
 ADMIN_RECORD_KIND,
 ADMIN_TRANSFER_STATUS,
} from "@gopvp/admin/src/constants/endpoint";
import { SPEED_CHECK_STALE_DAYS } from "@gopvp/admin/src/constants/limit";
import {
 RECORD_STATUS_STAGES,
 SPEED_STATUS_STAGES,
} from "@gopvp/admin/src/constants/mapper";
import { failedRefundedText } from "@gopvp/admin/src/constants/message";
import type {
 TAdminIssueRecord,
 TAdminSpeedCheck,
} from "@gopvp/admin/src/types";

export const isSpeedCheckStale = (check: TAdminSpeedCheck | null | undefined) =>
 !check || dayjs().diff(check.created, "day", true) > SPEED_CHECK_STALE_DAYS;

export const getRecordStatusLabel = ({ kind, status }: TAdminIssueRecord) =>
 kind === ADMIN_RECORD_KIND.WITHDRAW && status === ADMIN_TRANSFER_STATUS.FAILED
  ? failedRefundedText
  : formatText(status);

export const isSpeedStatusMismatch = (
 ourStatus: string,
 speedStatus: string,
) => {
 const ourStage = RECORD_STATUS_STAGES[ourStatus];
 const speedStage = SPEED_STATUS_STAGES[speedStatus.toLowerCase()];
 return !!ourStage && !!speedStage && ourStage !== speedStage;
};
