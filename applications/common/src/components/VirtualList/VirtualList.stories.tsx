import type { Meta, StoryObj } from "@storybook/react-vite";
import VirtualList from "./VirtualList";

const players = Array.from({ length: 50 }, (_, i) => ({ id: `p${i}`, name: `player_${i + 1}` }));

const meta: Meta<typeof VirtualList<(typeof players)[number]>> = {
    title: "Components/VirtualList",
    component: VirtualList,
    args: {
        data: players,
        computeItemKey: (_, item) => item.id,
        itemContent: (_, item) => <div style={{ padding: "8px 0" }}>{item.name}</div>,
        style: { height: "320px" },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
