import CustomMenuItem from "../MenuItem/MenuItem";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomMenu from "./Menu";

const meta: Meta<typeof CustomMenu> = {
    title: "Components/CustomMenu",
    component: CustomMenu,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: {
        open: true,
        anchorEl: null,
        children: [
            <CustomMenuItem key="a">knight_rider</CustomMenuItem>,
            <CustomMenuItem key="b">bishop_42</CustomMenuItem>,
        ],
    },
};
export default meta;
type Story = StoryObj<typeof CustomMenu>;

export const Default: Story = {};
