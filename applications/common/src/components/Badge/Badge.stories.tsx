import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomBadge from "./Badge";

const meta: Meta<typeof CustomBadge> = {
    title: "Components/CustomBadge",
    component: CustomBadge,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: { badgeContent: 3, color: "primary", children: <span>Matches</span> },
};
export default meta;
type Story = StoryObj<typeof CustomBadge>;

export const Default: Story = {};
export const Dot: Story = { args: { variant: "dot" } };
