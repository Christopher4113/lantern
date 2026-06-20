"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import {
  AuthDivider,
  AuthError,
  AuthField,
  AuthShell,
  GoogleButton,
} from "@/components/auth/auth-shell";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsLoading(true);

    const result = await signIn("credentials", {
      email: normalizeEmail(email),
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setFormError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your insider trade feed."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold-400 transition-colors hover:text-gold-300">
            Sign up
          </Link>
        </>
      }
    >
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthError message={formError} />

        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={fieldErrors.email}
          autoComplete="email"
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-navy-900 disabled:opacity-60"
        >
          {isLoading ? "Signing in…" : "Log in"}
        </button>

        <AuthDivider />
        <GoogleButton label="Sign in with Google" />
      </form>
    </AuthShell>
  );
}
