import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";

const meta: Meta<typeof CustomModal> = {
    title: "Components/CustomModal",
    component: CustomModal,
    argTypes: {
        open: { table: { type: { summary: "boolean" } } },
        onClose: { table: { type: { summary: "() => void" } } },
        title: { table: { type: { summary: "string" } } },
        preventOutsideClose: { table: { type: { summary: "boolean" } } },
        hideCloseIcon: { table: { type: { summary: "boolean" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { open: true, title: "Resign match?", onClose: () => {}, children: "You will lose your bet." },
};
export default meta;
type Story = StoryObj<typeof CustomModal>;

export const Default: Story = {};
export const WithoutCloseIcon: Story = { args: { hideCloseIcon: true } };
export const PreventOutsideClose: Story = { args: { preventOutsideClose: true } };
