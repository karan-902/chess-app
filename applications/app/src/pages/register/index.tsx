import AuthLayout from "@gopvp/app/src/container/AuthLayout";
import RegisterForm from "@gopvp/app/src/pages/register/RegisterForm";
import {
 createAccountText,
 haveAccountPromptText,
 loginText,
} from "@gopvp/app/src/constants/messages";
import { NavLink } from "react-router-dom";

export default function Register() {
 return (
  <AuthLayout
   title={createAccountText}
   footer={
    <>
     {haveAccountPromptText}

     <NavLink to="/login">{loginText}</NavLink>
    </>
   }
  >
   <RegisterForm />
  </AuthLayout>
 );
}
