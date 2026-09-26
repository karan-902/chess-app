import AuthLayout from "@gopvp/chess/src/container/AuthLayout";
import RegisterForm from "@gopvp/chess/src/pages/register/RegisterForm";
import {
 createAccountText,
 haveAccountPromptText,
 loginText,
} from "@gopvp/chess/src/constants/messages";
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
