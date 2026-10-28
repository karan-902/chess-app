import { RouterProvider } from "react-router-dom";
import { router } from "@gopvp/admin/src/routes/router";

export default function App() {
 return <RouterProvider router={router} />;
}
