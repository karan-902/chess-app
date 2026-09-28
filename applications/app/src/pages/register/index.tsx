import AuthLayout from "@gopvp/app/src/container/AuthLayout";
import RegisterForm from "@gopvp/app/src/pages/register/RegisterForm";
import {
 createAccountText,
 haveAccountPromptText,
 loginText,
} from "@gopvp/app/src/constants/message";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@gopvp/app/src/constants/route";

export default function Register() {
 return (
  <AuthLayout
   title={createAccountText}
   footer={
    <>
     {haveAccountPromptText}

     <NavLink to={ROUTES.LOGIN}>{loginText}</NavLink>
    </>
   }
  >
   <RegisterForm />
  </AuthLayout>
 );
}
