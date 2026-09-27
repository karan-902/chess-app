import type { Meta, StoryObj } from "@storybook/react-vite";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

const meta: Meta<typeof Skeleton> = {
 title: "Components/Skeleton",
 component: Skeleton,
 argTypes: { customClass: { table: { type: { summary: "string" } } } },
 args: { variant: "rounded", width: 240, height: 24 },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Rounded: Story = {};
export const Circular: Story = {
 args: { variant: "circular", width: 52, height: 52 },
};
export const TextLine: Story = {
 args: { variant: "text", width: 180, height: undefined },
};
