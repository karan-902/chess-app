import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomSelect from "./Select";

const options = [
    { value: "India", label: "India" },
    { value: "Germany", label: "Germany" },
    { value: "Brazil", label: "Brazil" },
];

const meta: Meta<typeof CustomSelect> = {
    title: "Components/CustomSelect",
    component: CustomSelect,
    argTypes: {
        value: { table: { type: { summary: "string" } } },
        onChange: { table: { type: { summary: "(value: string) => void" } } },
        options: { table: { type: { summary: "ISelectOption[]" } } },
        placeholder: { table: { type: { summary: "string" } } },
        searchable: { table: { type: { summary: "boolean" } } },
        searchPlaceholder: { table: { type: { summary: "string" } } },
        isError: { table: { type: { summary: "boolean" } } },
        helperText: { table: { type: { summary: "string" } } },
        disabled: { table: { type: { summary: "boolean" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { options, placeholder: "Select country" },
    render: (args) => {
        const [value, setValue] = useState("");
        return <CustomSelect {...args} value={value} onChange={setValue} />;
    },
};
export default meta;
type Story = StoryObj<typeof CustomSelect>;

export const Default: Story = {};
export const Searchable: Story = { args: { searchable: true, searchPlaceholder: "Search" } };
export const WithError: Story = { args: { isError: true, helperText: "Country is required" } };
export const Disabled: Story = { args: { disabled: true } };
