import { useNavigate } from "react-router-dom";
// import { useReduxDispatch } from "@gopvp/app/src/redux/hooks";
// import { login } from "@gopvp/app/src/redux/auth/thunk";
// import { showLoader, hideLoader } from "@gopvp/app/src/redux/common/slice";
// import { settingUpAccountText } from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";
import EmailFormScreen from "@gopvp/app/src/pages/register/EmailFormScreen";

export default function RegisterForm() {
 // const dispatch = useReduxDispatch();
 const navigate = useNavigate();

 // const handleRegistered = async (email: string, password: string) => {
 //  dispatch(showLoader({ text: settingUpAccountText }));
 //  try {
 //   await dispatch(login({ email, password })).unwrap();
 //  } catch {
 //   navigate(ROUTES.LOGIN, { replace: true });
 //  } finally {
 //   dispatch(hideLoader());
 //  }
 // };

 const handleRegistered = () => navigate(ROUTES.LOGIN, { replace: true });

 return <EmailFormScreen onRegistered={handleRegistered} />;
}
