import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CustomTabs, CustomTab } from "@gopvp/common/src/components/Tabs/Tabs";

const meta: Meta<typeof CustomTabs> = {
 title: "Components/CustomTabs",
 component: CustomTabs,
 argTypes: { customClass: { table: { type: { summary: "string" } } } },
 render: function TabsStory(args) {
  const [value, setValue] = useState("play");
  return (
   <CustomTabs {...args} value={value} onChange={(_, next) => setValue(next)}>
    <CustomTab value="play" label="Play" />
    <CustomTab value="matches" label="Matches" />
    <CustomTab value="leaderboard" label="Leaderboard" />
   </CustomTabs>
  );
 },
};
export default meta;
type Story = StoryObj<typeof CustomTabs>;

export const Default: Story = {};
