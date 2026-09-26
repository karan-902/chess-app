import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomSwitch from "./Switch";

const meta: Meta<typeof CustomSwitch> = {
    title: "Components/CustomSwitch",
    component: CustomSwitch,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: { defaultChecked: false },
};
export default meta;
type Story = StoryObj<typeof CustomSwitch>;

export const Off: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
