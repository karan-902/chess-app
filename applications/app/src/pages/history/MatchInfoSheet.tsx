import { useEffect, useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import Input from "@gopvp/common/src/components/Input/Input";
import ResultSheet from "@gopvp/app/src/components/common/ResultSheet";
import CopyButton from "@gopvp/app/src/components/common/CopyButton";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import {
 formatAmount,
 formatDateTime,
 formatNumber,
 shortenUsername,
} from "@gopvp/common/src/util/format";
import {
 MATCH_RESULT_OUTCOMES,
 MATCH_OUTCOME_SUBTITLES,
} from "@gopvp/common/src/constants/mapper";
import { MATCH_OUTCOME_TONES } from "@gopvp/app/src/constants/mapper";
import { youText } from "@gopvp/common/src/constants/message";
import { matchIdText } from "@gopvp/app/src/constants/message";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { getWorldMatchHeadline } from "@gopvp/app/src/utils";
import type {
 IMatchInfoResponse,
 IWorldMatchInfoResponse,
} from "@gopvp/common/src/types/response";
import type { IMatchInfoSheetProps } from "@gopvp/app/src/types/component";

export default function MatchInfoSheet({
 match,
 onClose,
}: IMatchInfoSheetProps) {
 const { gameLabel } = useGame();
 const [info, setInfo] = useState<
  IMatchInfoResponse | IWorldMatchInfoResponse | null
 >(null);
 const matchId = match?.id;
 const isWorldwide = !!match && "winner" in match;

 useEffect(() => {
  if (!matchId) return;
  let isCancelled = false;
  const loadInfo = async () => {
   setInfo(null);
   try {
    const res = await callAPIInterface<
     IMatchInfoResponse | IWorldMatchInfoResponse,
     undefined
    >(
     "GET",
     `${ENDPOINTS.MATCH_INFO}/${matchId}${isWorldwide ? "?scope=worldwide" : ""}`,
    );
    if (!isCancelled) setInfo(res);
   } catch (err) {
    showApiErrorToast(err);
    if (!isCancelled) onClose();
   }
  };
  loadInfo();
  return () => {
   isCancelled = true;
  };
 }, [matchId, isWorldwide, onClose]);

 const worldInfo = info && "winner" in info ? info : null;
 const ownInfo = info && "you" in info ? info : null;
 const ownMatch = match && "result" in match ? match : null;
 const result = ownInfo?.result ?? ownMatch?.result;
 const outcome = result && MATCH_RESULT_OUTCOMES[result];
 const opponentName = ownInfo ? shortenUsername(ownInfo.opponent.username) : "";

 return (
  <ResultSheet
   open={!!match}
   onClose={onClose}
   tone={
    worldInfo || isWorldwide
     ? "gold"
     : outcome
       ? MATCH_OUTCOME_TONES[outcome]
       : "neutral"
   }
   title={gameLabel}
   subtitle={
    worldInfo
     ? getWorldMatchHeadline(
        worldInfo.winner.username,
        worldInfo.loser.username,
       )
     : outcome
       ? MATCH_OUTCOME_SUBTITLES[outcome](opponentName)
       : ""
   }
   amount={
    worldInfo
     ? `+${formatAmount(worldInfo.amount)}`
     : ownInfo
       ? `${ownInfo.amount > 0 ? "+" : ""}${formatAmount(ownInfo.amount)}`
       : undefined
   }
   tiles={
    worldInfo
     ? [
        {
         label: shortenUsername(worldInfo.winner.username),
         value: formatNumber(worldInfo.winner.score),
        },
        {
         label: shortenUsername(worldInfo.loser.username),
         value: formatNumber(worldInfo.loser.score),
        },
       ]
     : ownInfo && [
        { label: youText, value: formatNumber(ownInfo.you.score) },
        { label: opponentName, value: formatNumber(ownInfo.opponent.score) },
       ]
   }
   skeletonTiles={2}
   tileIcon="person"
   customClass="gold-foil"
  >
   <Box customClass="result-meta">
    {!isWorldwide &&
     (info ? (
      <Input
       id="match-id"
       label={matchIdText}
       value={info.id}
       disabled
       fullWidth
       customClass="match-id-input gold-foil"
       endIcon={<CopyButton text={info.id} />}
      />
     ) : (
      <>
       <Skeleton customClass="text match-id-label-skeleton" width={60} />
       <Skeleton variant="rounded" customClass="match-id-skeleton" />
      </>
     ))}
    <Text customClass="meta-text">
     {info ? (
      formatDateTime(info.created)
     ) : (
      <Skeleton customClass="text" width={120} />
     )}
    </Text>
   </Box>
  </ResultSheet>
 );
}
