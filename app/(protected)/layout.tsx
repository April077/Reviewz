// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "../components/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <header className="flex pt-4  justify-center ">
        <Navbar />
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto ">{children}</main>
    </div>
  );
}
