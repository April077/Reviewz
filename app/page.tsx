"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-gray-800">TestiWall</h1>
        <div className="space-x-4">
          <Link href="/auth/signin">
            <Button variant="outline" className="rounded-xl px-6 py-2">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-xl px-6 py-2">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center mt-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-900"
        >
          Collect & Showcase Testimonials with Ease
        </motion.h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Empower your brand with authentic video and text testimonials. Create a
          shareable link, gather reviews, and embed them beautifully on your
          website.
        </p>

        <div className="mt-8 flex gap-4">
          <Link href="/signup">
            <Button size="lg" className="rounded-xl px-8 py-3 text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="lg" variant="outline" className="rounded-xl px-8 py-3 text-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 mt-24 px-10 max-w-6xl mx-auto">
        {[
          {
            title: "Simple Links",
            desc: "Generate a unique link for your customers to submit testimonials.",
          },
          {
            title: "Video & Text Reviews",
            desc: "Collect reviews in the form of engaging videos or text.",
          },
          {
            title: "Beautiful Embed Wall",
            desc: "Showcase all testimonials in a modern, customizable wall.",
          },
        ].map((feature, idx) => (
          <Card key={idx} className="rounded-2xl shadow-md hover:shadow-lg transition">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-24 py-8 text-center text-gray-500 border-t">
        © {new Date().getFullYear()} TestiWall. All rights reserved.
      </footer>
    </div>
  );
}
