import CloseIcon from "@mui/icons-material/Close";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CustomIconButton from "./IconButton";

const meta: Meta<typeof CustomIconButton> = {
    title: "Components/CustomIconButton",
    component: CustomIconButton,
    argTypes: { customClass: { table: { type: { summary: "string" } } } },
    args: { children: <CloseIcon />, "aria-label": "Close" },
};
export default meta;
type Story = StoryObj<typeof CustomIconButton>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
