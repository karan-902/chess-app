import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { Preview } from "@storybook/react-vite";
import "../src/styles/default.scss";

const darkTheme = createTheme({ palette: { mode: "dark" } });

const preview: Preview = {
    decorators: [
        (Story) => (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Story />
            </ThemeProvider>
        ),
    ],
};

export default preview;
