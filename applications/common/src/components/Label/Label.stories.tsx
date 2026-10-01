import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomLabel from "@gopvp/common/src/components/Label/Label";

const meta: Meta<typeof CustomLabel> = {
 title: "Components/CustomLabel",
 component: CustomLabel,
 argTypes: { customClass: { table: { type: { summary: "string" } } } },
 args: { children: "Username" },
};
export default meta;
type Story = StoryObj<typeof CustomLabel>;

export const Default: Story = {};
export const Error: Story = { args: { error: true } };
