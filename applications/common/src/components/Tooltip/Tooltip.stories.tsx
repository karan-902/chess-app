import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomTooltip from "@gopvp/common/src/components/Tooltip/Tooltip";

const meta: Meta<typeof CustomTooltip> = {
 title: "Components/CustomTooltip",
 component: CustomTooltip,
 argTypes: { customClass: { table: { type: { summary: "string" } } } },
 args: {
  title: "Copy to clipboard",
  open: true,
  children: <span>Hover me</span>,
 },
};
export default meta;
type Story = StoryObj<typeof CustomTooltip>;

export const Default: Story = {};
export const Bottom: Story = { args: { placement: "bottom" } };
