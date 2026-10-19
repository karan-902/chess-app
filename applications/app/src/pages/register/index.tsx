import AuthLayout from "@gopvp/app/src/container/AuthLayout";
import RegisterForm from "@gopvp/app/src/pages/register/RegisterForm";
import {
 joinTheWinnersText,
 beatRealPlayersText,
 beenHereBeforeText,
 yourWinsAreWaitingText,
 logInText,
} from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";

export default function Register() {
 return (
  <AuthLayout
   title={joinTheWinnersText}
   subtitle={beatRealPlayersText}
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
