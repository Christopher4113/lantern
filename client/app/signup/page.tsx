"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import {
  AuthDivider,
  AuthError,
  AuthField,
  AuthShell,
  GoogleButton,
} from "@/components/auth/auth-shell";
import {
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from "@/lib/auth-validation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    const passwordError = validatePassword(password);
    if (!password) {
      errors.password = "Password is required.";
    } else if (passwordError) {
      errors.password = passwordError;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(email),
          password,
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setFormError(signupData.error ?? "Could not create account.");
        setIsLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: normalizeEmail(email),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setFormError("Account created, but sign-in failed. Please log in.");
        setIsLoading(false);
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking trades from people who move markets."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-gold-400 transition-colors hover:text-gold-300">
            Log in
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
          placeholder="At least 8 characters"
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        <AuthField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repeat your password"
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-navy-900 disabled:opacity-60"
        >
          {isLoading ? "Creating account…" : "Create account"}
        </button>

        <AuthDivider />
        <GoogleButton label="Sign up with Google" />
      </form>
    </AuthShell>
  );
}
