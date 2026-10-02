import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomAppBar from "@gopvp/common/src/components/AppBar/AppBar";

const meta: Meta<typeof CustomAppBar> = {
 title: "Components/CustomAppBar",
 component: CustomAppBar,
 argTypes: {
  brand: { table: { type: { summary: "ReactNode" } } },
  bottomSlot: { table: { type: { summary: "ReactNode" } } },
  customClass: { table: { type: { summary: "string" } } },
 },
 args: { brand: "GoPVP", position: "static" },
};
export default meta;
type Story = StoryObj<typeof CustomAppBar>;

export const Default: Story = {};
export const WithBottomSlot: Story = {
 args: { bottomSlot: "Bottom navigation" },
};
