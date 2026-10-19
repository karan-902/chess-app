import { useNavigate } from "react-router-dom";
import { callAPIInterface } from "@gopvp/common/src/util/api";
import sessionService from "@gopvp/common/src/util/sessionService";
import { useReduxSelector, useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { showLoader, hideLoader } from "@gopvp/app/src/redux/common/slice";
import { ROUTES } from "@gopvp/app/src/constants/route";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import type { IGenerateTokenBody } from "@gopvp/common/src/types/payload";

export function useLogout(text?: string) {
 const navigate = useNavigate();
 const dispatch = useReduxDispatch();
 const session = useReduxSelector((s) => s.auth.session);

 return async () => {
  dispatch(showLoader({ text }));
  try {
   if (session?.access_token)
    await callAPIInterface<unknown, IGenerateTokenBody>("POST", ENDPOINTS.LOGOUT, {
     refresh_token: session.refresh_token,
    });
  } catch (error) {
   console.error(error);
  } finally {
   await sessionService.deleteSession();
   navigate(ROUTES.LOGIN);
   dispatch(hideLoader());
  }
 };
}
