import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import OTPInput from "@gopvp/common/src/components/OtpInput/OtpInput";

const meta: Meta<typeof OTPInput> = {
    title: "Components/OTPInput",
    component: OTPInput,
    argTypes: {
        length: { table: { type: { summary: "number" } } },
        value: { table: { type: { summary: "string" } } },
        onChange: { table: { type: { summary: "(value: string) => void" } } },
        onComplete: { table: { type: { summary: "(value: string) => void" } } },
        alphanumeric: { table: { type: { summary: "boolean" } } },
        customClass: { table: { type: { summary: "string" } } },
    },
    args: { length: 6 },
    render: (args) => {
        const [value, setValue] = useState("");
        return <OTPInput {...args} value={value} onChange={setValue} />;
    },
};
export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Numeric: Story = {};
export const Alphanumeric: Story = { args: { alphanumeric: true, length: 6 } };
