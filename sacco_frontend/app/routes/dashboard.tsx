import Dashboard from "~/dashboard/dashboard";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enterprize Sacco System" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function AdminDashboard() {
  return <Dashboard />;
}
