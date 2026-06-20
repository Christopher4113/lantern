import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-900" />}>
      <LoginForm />
    </Suspense>
  );
}
