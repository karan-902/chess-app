import AuthLayout from "@/container/AuthLayout";
import RegisterForm from "./RegisterForm";
import {
 authRegisterTitle,
 authRegisterHaveAccountPrompt,
 authRegisterLoginLink,
} from "@/constants/messages";
import { NavLink } from "react-router-dom";

export default function Register() {
 return (
  <AuthLayout
   title={authRegisterTitle}
   footer={
    <>
     {authRegisterHaveAccountPrompt}

     <NavLink to="/login">{authRegisterLoginLink}</NavLink>
    </>
   }
  >
   <RegisterForm />
  </AuthLayout>
 );
}
