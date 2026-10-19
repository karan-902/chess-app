import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomSwitch from "@gopvp/common/src/components/Switch/Switch";

const meta: Meta<typeof CustomSwitch> = {
 title: "Components/CustomSwitch",
 component: CustomSwitch,
 argTypes: { customClass: { table: { type: { summary: "string" } } } },
 args: { checked: false },
};
export default meta;
type Story = StoryObj<typeof CustomSwitch>;

export const Off: Story = {};
export const On: Story = { args: { checked: true } };
