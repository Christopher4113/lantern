import { Suspense } from "react";
import LoginPage from "./login-form";

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-900" />}>
      <LoginPage />
    </Suspense>
  );
}
