import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";

const meta: Meta<typeof CustomIconButton> = {
 title: "Components/CustomIconButton",
 component: CustomIconButton,
 argTypes: { customClass: { table: { type: { summary: "string" } } } },
 args: { icon: "close", "aria-label": "Close" },
};
export default meta;
type Story = StoryObj<typeof CustomIconButton>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
