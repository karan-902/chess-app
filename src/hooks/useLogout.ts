import { useNavigate } from "react-router";
import { callAPIInterface } from "@/utils";
import sessionService from "@/store/sessionService";
import { useReduxSelector } from "@/store/hooks";
import type { ILogoutBody } from "@/types/index";
import type { ILogoutResponse } from "@/types/utils";

export function useLogout() {
    const navigate = useNavigate();
    const session = useReduxSelector((s) => s.auth.session);

    return async () => {
        try {
            if (session?.session_id) {
                await callAPIInterface<ILogoutBody, ILogoutResponse>(
                    "POST",
                    "/logout",
                    { session_id: session.session_id },
                );
            }
        } catch {
            // proceed with client-side logout regardless
        } finally {
            await sessionService.deleteSession();
            navigate("/login");
        }
    };
}
