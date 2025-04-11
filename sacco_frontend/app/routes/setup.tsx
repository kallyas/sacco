import type { Route } from "./+types/home";
import CompanySetupPage from "~/setup/setup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enterprize Sacco System | Company Setup" },
    { name: "description", content: "Setup your company details" },
  ];
}

export default function AdminDashboard() {
  return <CompanySetupPage />;
}
