import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import {
 howStakingWorksText,
 stakingExplainedText,
 payoutsText,
 payoutRulesText,
 fairMatchingText,
 fairMatchingExplainedText,
 appVersionText,
 pieceSetCreditText,
} from "@gopvp/chess/src/constants/messages";

export default function ChessRules() {
    return (
        <Box customClass="rules-page">
            <Text component="h3" customClass="subsection-heading section-heading">
                {howStakingWorksText}
            </Text>
            <Text customClass="rules-text">{stakingExplainedText}</Text>

            <Text component="h3" customClass="subsection-heading section-heading">
                {payoutsText}
            </Text>
            <Text component="ul" customClass="rules-list">
                {payoutRulesText.map((item) => (
                    <Text key={item} component="li" customClass="rules-text">
                        {item}
                    </Text>
                ))}
            </Text>

            <Text component="h3" customClass="subsection-heading section-heading">
                {fairMatchingText}
            </Text>
            <Text customClass="rules-text">{fairMatchingExplainedText}</Text>

            <Text customClass="rules-about caption">
                {appVersionText}
                <br />
                {pieceSetCreditText}
            </Text>
        </Box>
    );
}
