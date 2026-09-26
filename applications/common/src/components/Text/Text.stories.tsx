import type { Meta, StoryObj } from "@storybook/react-vite";
import Text from "@gopvp/common/src/components/Text/Text";

const meta: Meta<typeof Text> = {
    title: "Components/Text",
    component: Text,
    argTypes: {
        uppercase: { table: { type: { summary: "boolean" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { children: "Checkmate in three moves" },
};
export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};
export const Uppercase: Story = { args: { uppercase: true } };
export const Truncated: Story = {
    args: { children: "A very long username that should be truncated with an ellipsis", sx: { width: "160px" } },
};
