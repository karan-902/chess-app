import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";

const meta: Meta<typeof CustomChip> = {
    title: "Components/CustomChip",
    component: CustomChip,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: { label: "BLITZ" },
};
export default meta;
type Story = StoryObj<typeof CustomChip>;

export const Default: Story = {};
export const Outlined: Story = { args: { variant: "outlined" } };
export const Clickable: Story = { args: { onClick: () => {} } };
