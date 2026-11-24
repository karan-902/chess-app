import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import { ArrowLeft } from "@gopvp/common/src/components/images";
import {
 formatAmount,
 formatDateTime,
 formatNumber,
} from "@gopvp/common/src/util/format";
import {
 ADMIN_ENDPOINTS,
 ADMIN_ISSUE_STATUS,
} from "@gopvp/admin/src/constants/endpoint";
import {
 ISSUE_STATUS_LABELS,
 ISSUE_TYPE_LABELS,
 RECORD_KIND_LABELS,
} from "@gopvp/admin/src/constants/label";
import {
 ISSUE_STATUS_TONES,
 RECORD_STATUS_TONES,
 SPEED_CHECK_SOURCE_KINDS,
} from "@gopvp/admin/src/constants/mapper";
import { ROUTES } from "@gopvp/admin/src/constants/route";
import {
 adjustText,
 amountText,
 backToProblemsText,
 foundAtText,
 markResolvedText,
 noRecordText,
 noteText,
 ourRecordText,
 recordIdText,
 resolvedByText,
 resolvedOnText,
 resolvedText,
 retryNotFixedText,
 retryText,
 satsText,
 sourceIdText,
 speedIdText,
 statusText,
 typeText,
} from "@gopvp/admin/src/constants/message";
import { useAdminGet } from "@gopvp/admin/src/hooks/useAdminGet";
import { getRecordStatusLabel } from "@gopvp/admin/src/utils/status";
import ErrorNotice from "@gopvp/admin/src/components/ErrorNotice";
import FieldList from "@gopvp/admin/src/components/FieldList";
import SpeedCheckCard from "@gopvp/admin/src/pages/problems/SpeedCheckCard";
import ResolveProblemModal from "@gopvp/admin/src/pages/problems/ResolveProblemModal";
import RetryProblemModal from "@gopvp/admin/src/pages/problems/RetryProblemModal";
import AdjustProblemModal from "@gopvp/admin/src/pages/problems/AdjustProblemModal";
import type { TAdminField, TAdminIssueDetail } from "@gopvp/admin/src/types";

type TProblemModal = "resolve" | "retry" | "adjust";

export default function ProblemDetail() {
 const { id = "" } = useParams();
 const navigate = useNavigate();
 const detailRequest = useAdminGet<TAdminIssueDetail>(
  `${ADMIN_ENDPOINTS.ISSUES}/${id}`,
 );
 const [activeModal, setActiveModal] = useState<TProblemModal | null>(null);
 const [isRetryNotFixed, setIsRetryNotFixed] = useState(false);

 const openModal = (modal: TProblemModal) => {
  setIsRetryNotFixed(false);
  setActiveModal(modal);
 };
 const closeModal = () => setActiveModal(null);

 const backButton = (
  <Button
   customClass="admin-btn admin-back-btn"
   onClick={() => navigate(ROUTES.PROBLEMS)}
  >
   <ArrowLeft size={16} aria-hidden />
   {backToProblemsText}
  </Button>
 );

 const detail = detailRequest.data;
 if (!detail)
  return (
   <>
    {backButton}
    {detailRequest.error ? (
     <ErrorNotice message={detailRequest.error} />
    ) : (
     <Card customClass="admin-detail">
      <Skeleton width="40%" />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
     </Card>
    )}
   </>
  );

 const { issue, record, actions } = detail;
 const sourceKind = SPEED_CHECK_SOURCE_KINDS[issue.type];
 const speedCheckBody = record
  ? { type: record.kind, id: record.id }
  : sourceKind
    ? { type: sourceKind, id: issue.source_id }
    : null;
 const recordFields: TAdminField[] = record
  ? [
     { label: typeText, value: RECORD_KIND_LABELS[record.kind] ?? record.kind },
     { label: recordIdText, value: record.id },
     {
      label: statusText,
      value: getRecordStatusLabel(record),
      isChip: true,
      chipTone: RECORD_STATUS_TONES[record.status],
     },
     { label: speedIdText, value: record.provider_id },
     {
      label: amountText,
      value: formatAmount(record.amount),
      sub:
       record.target_amount === null
        ? undefined
        : satsText(formatNumber(record.target_amount)),
     },
    ]
  : [{ label: sourceIdText, value: issue.source_id }];
 const resolvedFields: TAdminField[] = [
  { label: resolvedByText, value: issue.resolved_by_name ?? "" },
  {
   label: resolvedOnText,
   value: issue.resolved ? formatDateTime(issue.resolved) : "",
  },
  { label: noteText, value: issue.resolution_note ?? "" },
 ];

 return (
  <>
   {backButton}

   <Box customClass="admin-detail-top">
    <Box customClass="admin-page-head">
     <Box customClass="admin-title-row">
      <Text component="h1" customClass="admin-page-title">
       {ISSUE_TYPE_LABELS[issue.type] ?? issue.type}
      </Text>
      <CustomChip
       label={ISSUE_STATUS_LABELS[issue.status] ?? issue.status}
       customClass={classNames(
        "admin-status",
        ISSUE_STATUS_TONES[issue.status],
       )}
      />
     </Box>
     <Text customClass="admin-page-hint">
      {foundAtText(formatDateTime(issue.created))}
     </Text>
    </Box>
    {(actions.retry || actions.adjust || actions.resolve) && (
     <Box customClass="admin-actions">
      {actions.retry && (
       <Button
        customClass="admin-btn secondary"
        onClick={() => openModal("retry")}
       >
        {retryText}
       </Button>
      )}
      {actions.adjust && (
       <Button
        customClass="admin-btn secondary"
        onClick={() => openModal("adjust")}
       >
        {adjustText}
       </Button>
      )}
      {actions.resolve && (
       <Button
        customClass="admin-btn primary"
        onClick={() => openModal("resolve")}
       >
        {markResolvedText}
       </Button>
      )}
     </Box>
    )}
   </Box>

   <Card customClass="admin-detail">
    <Text customClass="admin-problem-detail">{issue.detail}</Text>
   </Card>

   {isRetryNotFixed && <ErrorNotice message={retryNotFixedText} />}

   <Box customClass="admin-detail-grid">
    <Card customClass="admin-detail">
     <Text component="h2" customClass="admin-section-title">
      {ourRecordText}
     </Text>
     {!record && <Text customClass="admin-page-hint">{noRecordText}</Text>}
     <FieldList fields={recordFields} />
    </Card>
    <SpeedCheckCard body={speedCheckBody} />
   </Box>

   {issue.status === ADMIN_ISSUE_STATUS.RESOLVED && (
    <Card customClass="admin-detail">
     <Text component="h2" customClass="admin-section-title">
      {resolvedText}
     </Text>
     <FieldList fields={resolvedFields} />
    </Card>
   )}

   {activeModal === "resolve" && (
    <ResolveProblemModal
     issueId={issue.id}
     onClose={closeModal}
     onDone={detailRequest.reload}
    />
   )}
   {activeModal === "retry" && (
    <RetryProblemModal
     issueId={issue.id}
     onClose={closeModal}
     onDone={detailRequest.reload}
     onNotFixed={() => setIsRetryNotFixed(true)}
    />
   )}
   {activeModal === "adjust" && (
    <AdjustProblemModal
     issueId={issue.id}
     issueType={issue.type}
     record={record}
     onClose={closeModal}
     onDone={detailRequest.reload}
    />
   )}
  </>
 );
}
