import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";

const meta: Meta<typeof CustomAvatar> = {
    title: "Components/CustomAvatar",
    component: CustomAvatar,
    argTypes: {
        letter: { table: { type: { summary: "string" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { letter: "KD", customClass: "md neutral" },
};
export default meta;
type Story = StoryObj<typeof CustomAvatar>;

export const Default: Story = {};
export const Small: Story = { args: { customClass: "sm primary", letter: "K" } };
