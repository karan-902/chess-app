import type { Meta, StoryObj } from "@storybook/react-vite";
import VirtualList from "./VirtualList";

const players = Array.from({ length: 50 }, (_, i) => ({ id: `p${i}`, name: `player_${i + 1}` }));

const meta: Meta<typeof VirtualList<(typeof players)[number]>> = {
    title: "Components/VirtualList",
    component: VirtualList,
    argTypes: {
        data: { table: { type: { summary: "T[]" } } },
        itemKey: { table: { type: { summary: "(item: T) => string" } } },
        renderItem: { table: { type: { summary: "(item: T) => ReactNode" } } },
        renderSkeleton: { table: { type: { summary: "() => ReactNode" } } },
        loading: { table: { type: { summary: "boolean" } } },
        loadingMore: { table: { type: { summary: "boolean" } } },
        hasMore: { table: { type: { summary: "boolean" } } },
        loadMore: { table: { type: { summary: "() => void" } } },
        skeletonCount: { table: { type: { summary: "number" } } },
        empty: { table: { type: { summary: "ReactNode" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: {
        data: players,
        itemKey: (item) => item.id,
        renderItem: (item) => <div style={{ padding: "8px 0" }}>{item.name}</div>,
        renderSkeleton: () => <div style={{ padding: "8px 0" }}>Loading…</div>,
    },
    decorators: [(Story) => <div style={{ height: "320px" }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true, data: [] } };
export const Empty: Story = { args: { data: [], empty: "No matches yet" } };
