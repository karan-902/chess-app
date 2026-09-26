import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "./Box";

const meta: Meta<typeof Box> = {
    title: "Components/Box",
    component: Box,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: { children: "Box content", sx: { padding: "16px" } },
};
export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {};
