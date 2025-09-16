// app/layout.tsx
import "./globals.css";
import { Providers } from "./components/Providers";
import QueryProviders from "./provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProviders>
          {" "}
          <Providers>{children}</Providers>
        </QueryProviders>
      </body>
    </html>
  );
}
