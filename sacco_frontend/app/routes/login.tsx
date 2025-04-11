import LoginPage from "~/auth/login";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enterprize Sacco System | Login" },
    { name: "description", content: "Welcome to Enterprize Sacco System!, Login to access your account" },
  ];
}

export default function Login() {
  return <LoginPage />
}
