import ResetPasswordPage from "~/auth/reset-password";
import type { Route } from "./+types/home";
import { PublicOnlyRoute } from "~/providers/auth-provider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enterprize Sacco System | Forgot Password" },
    {
      name: "description",
      content: "Welcome to Enterprize Sacco System!, Forgot Password",
    },
  ];
}

export default function Login() {
  return (
    <PublicOnlyRoute>
      <ResetPasswordPage />
    </PublicOnlyRoute>
  );
}
