import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import {
    rulesStakingTitle,
    rulesStakingDesc,
    rulesPayoutsTitle,
    rulesPayoutsList,
    rulesMatchingTitle,
    rulesMatchingDesc,
    rulesAboutVersion,
    rulesAboutCredit,
} from "@/constants/messages";

export default function Rules() {
    return (
        <Box customClass="rules-page">
            <Text component="h3" customClass="rules-heading">
                {rulesStakingTitle}
            </Text>
            <Text customClass="rules-text">{rulesStakingDesc}</Text>

            <Text component="h3" customClass="rules-heading">
                {rulesPayoutsTitle}
            </Text>
            <Text component="ul" customClass="rules-list">
                {rulesPayoutsList.map((item) => (
                    <Text key={item} component="li" customClass="rules-text">
                        {item}
                    </Text>
                ))}
            </Text>

            <Text component="h3" customClass="rules-heading">
                {rulesMatchingTitle}
            </Text>
            <Text customClass="rules-text">{rulesMatchingDesc}</Text>

            <Text customClass="rules-about">
                {rulesAboutVersion}
                <br />
                {rulesAboutCredit}
            </Text>
        </Box>
    );
}
