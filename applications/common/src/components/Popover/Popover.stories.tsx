import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomPopover from "./Popover";

const meta: Meta<typeof CustomPopover> = {
    title: "Components/CustomPopover",
    component: CustomPopover,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: {
        open: true,
        anchorReference: "anchorPosition",
        anchorPosition: { top: 80, left: 80 },
        children: "Popover content",
    },
};
export default meta;
type Story = StoryObj<typeof CustomPopover>;

export const Default: Story = {};
