import type { Meta, StoryObj } from "@storybook/react-vite";
import SuccessCheckmark from "./SuccessCheckmark";

const meta: Meta<typeof SuccessCheckmark> = {
    title: "Components/SuccessCheckmark",
    component: SuccessCheckmark,
    argTypes: {
        confettiGif: { table: { type: { summary: "string" } } },
        confettiLottieSrc: { table: { type: { summary: "string" } } },
        tickLottieSrc: { table: { type: { summary: "string" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
};
export default meta;
type Story = StoryObj<typeof SuccessCheckmark>;

export const Default: Story = {};
