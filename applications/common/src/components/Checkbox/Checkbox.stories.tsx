import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomCheckbox from "./Checkbox";

const meta: Meta<typeof CustomCheckbox> = {
    title: "Components/CustomCheckbox",
    component: CustomCheckbox,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: { defaultChecked: false },
};
export default meta;
type Story = StoryObj<typeof CustomCheckbox>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
