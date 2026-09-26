import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomAvatar from "./Avatar";

const meta: Meta<typeof CustomAvatar> = {
    title: "Components/CustomAvatar",
    component: CustomAvatar,
    argTypes: {
        letter: { table: { type: { summary: "string" } } },
        online: { table: { type: { summary: "boolean" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { letter: "KD", customClass: "md neutral" },
};
export default meta;
type Story = StoryObj<typeof CustomAvatar>;

export const Default: Story = {};
export const Online: Story = { args: { online: true } };
export const Small: Story = { args: { customClass: "sm primary", letter: "K" } };
