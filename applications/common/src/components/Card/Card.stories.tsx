import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "./Card";

const meta: Meta<typeof Card> = {
    title: "Components/Card",
    component: Card,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: { children: "Card content", sx: { padding: "16px" } },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
