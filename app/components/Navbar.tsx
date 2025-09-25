"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  if (status === "loading") {
    return <div className="h-12" />; // placeholder while session loads
  }

  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;

  return (
    <nav className="bg-white shadow-md rounded-4xl border-b border-gray-200 px-6 py-2 flex justify-between items-center">
      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link
          href="/spaces"
          className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
        >
          Spaces
        </Link>

        {/* User Avatar Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer transition flex items-center justify-center text-white font-semibold bg-indigo-500 text-lg"
          >
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={40}
                height={40}
                className="rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{userName.charAt(0).toUpperCase()}</span>
            )}
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
