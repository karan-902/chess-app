import AuthLayout from "@/container/AuthLayout";
import RegisterForm from "./RegisterForm";
import {
 createAccountText,
 haveAccountPromptText,
 loginText,
} from "@/constants/messages";
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
