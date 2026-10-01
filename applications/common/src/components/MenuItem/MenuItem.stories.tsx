import { MenuList } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomMenuItem from "@gopvp/common/src/components/MenuItem/MenuItem";

const meta: Meta<typeof CustomMenuItem> = {
 title: "Components/CustomMenuItem",
 component: CustomMenuItem,
 argTypes: { customClass: { table: { type: { summary: "string" } } } },
 args: { children: "knight_rider" },
 decorators: [
  (Story) => (
   <MenuList>
    <Story />
   </MenuList>
  ),
 ],
};
export default meta;
type Story = StoryObj<typeof CustomMenuItem>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Selected: Story = { args: { selected: true } };
