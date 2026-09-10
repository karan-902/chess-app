import AuthLayout from "@/container/AuthLayout";
import RegisterForm from "./RegisterForm";
import {
 authRegisterTitle,
 authRegisterSubtitle,
 authRegisterHaveAccountPrompt,
 authRegisterLoginLink,
} from "@/constants/messages";
import { Link } from "react-router";

export default function Register() {
 return (
  <AuthLayout
   title={authRegisterTitle}
   subtitle={authRegisterSubtitle}
   footer={
    <>
     {authRegisterHaveAccountPrompt}{" "}
     <Link to="/login">{authRegisterLoginLink}</Link>
    </>
   }
  >
   <RegisterForm />
  </AuthLayout>
 );
}
