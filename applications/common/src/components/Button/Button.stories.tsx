import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@gopvp/common/src/components/Button/Button";

const meta: Meta<typeof Button> = {
 title: "Components/Button",
 component: Button,
 argTypes: {
  isLoading: { table: { type: { summary: "boolean" } } },
  loaderOnDark: { table: { type: { summary: "boolean" } } },
  customClass: { table: { type: { summary: "string" } } },
 },
 args: { children: "Play now", variant: "contained" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Contained: Story = {};
export const Outlined: Story = {
 args: { variant: "outlined", children: "Cancel" },
};
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { disabled: true } };
