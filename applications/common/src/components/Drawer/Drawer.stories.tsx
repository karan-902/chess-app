import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomDrawer from "./Drawer";

const meta: Meta<typeof CustomDrawer> = {
    title: "Components/CustomDrawer",
    component: CustomDrawer,
    argTypes: {
        open: { table: { type: { summary: "boolean" } } },
        onClose: { table: { type: { summary: "() => void" } } },
        anchor: { control: "select", options: ["left", "right", "bottom"], table: { type: { summary: '"left" | "right" | "bottom"' } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { open: true, anchor: "bottom", onClose: () => {}, children: "Drawer content" },
};
export default meta;
type Story = StoryObj<typeof CustomDrawer>;

export const Bottom: Story = {};
export const Right: Story = { args: { anchor: "right" } };
