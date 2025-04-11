
import ForgotPasswordPage from "~/auth/forgot-password";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enterprize Sacco System | Forgot Password" },
    { name: "description", content: "Welcome to Enterprize Sacco System!, Forgot Password" },
  ];
}

export default function Login() {
  return <ForgotPasswordPage />;
}
