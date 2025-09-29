"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "Invalid email or password");
        setLoading(false); // reset only on error
      } else if (res?.ok) {
        router.push("/spaces");
        // no setLoading(false) here, stays "Signing In..." until redirect
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

const handleGoogleSignIn = async () => {
  setLoading(true);
  try {
    await signIn("google", { callbackUrl: "/spaces" });
    // Don't reset loading here — the page will redirect anyway
  } catch (err) {
    console.error(err);
    setLoading(false); // only reset if something fails
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">
          Sign In
        </h1>
        <p className="text-center text-gray-500">
          Sign in to start creating and managing your spaces
        </p>

        {error && (
          <p className="text-red-600 transition-all text-center">{error}</p>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full border border-gray-300 rounded-lg p-3 space-x-2 hover:bg-gray-100 transition"
        >
          <FcGoogle size={24} />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

        <div className="flex items-center justify-center text-gray-400">or</div>

        {/* Credentials Form */}
        <form
          onSubmit={handleSubmit}
          className="flex text-black flex-col space-y-4"
        >
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              suppressHydrationWarning
              className="border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition w-full"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suppressHydrationWarning
              className="border border-gray-300 rounded-lg p-3 w-full pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg transition flex justify-center items-center cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
