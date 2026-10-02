import type { Meta, StoryObj } from "@storybook/react-vite";
import AlertMessage from "@gopvp/common/src/components/AlertMessage/AlertMessage";

const meta: Meta<typeof AlertMessage> = {
 title: "Components/AlertMessage",
 component: AlertMessage,
 argTypes: {
  severity: {
   control: "select",
   options: ["error", "warning", "success", "info"],
   table: { type: { summary: '"error" | "warning" | "success" | "info"' } },
  },
  message: { table: { type: { summary: "string" } } },
  customClass: { table: { type: { summary: "string" } } },
 },
 args: {
  severity: "info",
  message: "Withdrawals are processed within a few minutes.",
 },
};
export default meta;
type Story = StoryObj<typeof AlertMessage>;

export const Info: Story = {};
export const Success: Story = {
 args: { severity: "success", message: "Deposit received." },
};
export const Warning: Story = {
 args: { severity: "warning", message: "Only winnings are withdrawable." },
};
export const Error: Story = {
 args: { severity: "error", message: "Withdrawal failed. Please try again." },
};
