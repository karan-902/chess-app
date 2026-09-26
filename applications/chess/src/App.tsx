import { RouterProvider } from "react-router-dom";
import { router } from "@gopvp/chess/src/routes/router";

export default function App() {
    return <RouterProvider router={router} />;
}
