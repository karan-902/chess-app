import type { Meta, StoryObj } from "@storybook/react-vite";
import Accordion from "@gopvp/common/src/components/Accordion/Accordion";

const meta: Meta<typeof Accordion> = {
    title: "Components/Accordion",
    component: Accordion,
    argTypes: {
        summary: { table: { type: { summary: "ReactNode" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { summary: "How are payouts calculated?", children: "Winners receive the pot minus the platform fee." },
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};
export const Expanded: Story = { args: { defaultExpanded: true } };
