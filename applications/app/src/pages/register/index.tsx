import AuthLayout from "@gopvp/app/src/container/AuthLayout";
import RegisterForm from "@gopvp/app/src/pages/register/RegisterForm";
import {
 joinTheText,
 winnersText,
 signUpFindRivalText,
 winRealCashText,
 beenHereBeforeText,
 yourWinsAreWaitingText,
 logInText,
} from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";

export default function Register() {
 return (
  <AuthLayout
   title={joinTheText}
   titleAccent={winnersText}
   subtitle={signUpFindRivalText}
   subtitleAccent={winRealCashText}
   footerCard={{
    title: beenHereBeforeText,
    tagline: yourWinsAreWaitingText,
    actionText: logInText,
    to: ROUTES.LOGIN,
   }}
  >
   <RegisterForm />
  </AuthLayout>
 );
}
