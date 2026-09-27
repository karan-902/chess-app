import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "@gopvp/common/src/components/Input/Input";

const meta: Meta<typeof Input> = {
 title: "Components/Input",
 component: Input,
 argTypes: {
  label: { table: { type: { summary: "ReactNode" } } },
  isError: { table: { type: { summary: "boolean" } } },
  helperText: { table: { type: { summary: "string" } } },
  startIcon: { table: { type: { summary: "ReactNode" } } },
  endIcon: { table: { type: { summary: "ReactNode" } } },
  labelClassName: { table: { type: { summary: "string" } } },
  customClass: { table: { type: { summary: "string" } } },
 },
 args: { label: "Email", placeholder: "you@example.com", fullWidth: true },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithError: Story = {
 args: { isError: true, helperText: "Please enter a valid email" },
};
export const Password: Story = {
 args: { label: "Password", type: "password", placeholder: "" },
};
export const Disabled: Story = {
 args: { disabled: true, value: "locked@example.com" },
};
