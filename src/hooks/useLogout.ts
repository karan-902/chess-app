import { useNavigate } from "react-router";
import { callAPIInterface } from "@/utils";
import sessionService from "@/redux/sessionService";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { showLoader, hideLoader } from "@/redux/common/common.slice";
import type { ILogoutBody } from "@/types/index";
import type { ILogoutResponse } from "@/types/utils";

export function useLogout(text?: string) {
    const navigate = useNavigate();
    const dispatch = useReduxDispatch();
    const session = useReduxSelector((s) => s.auth.session);

    return async () => {
        dispatch(showLoader({ text }));
        try {
            if (session?.session_id) {
                await callAPIInterface<ILogoutBody, ILogoutResponse>(
                    "POST",
                    "/logout",
                    { session_id: session.session_id },
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            await sessionService.deleteSession();
            navigate("/login");
            dispatch(hideLoader());
        }
    };
}
