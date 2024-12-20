import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "@/components/ui/provider";

export const metadata: Metadata = {
  title: "Filum",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider dynamic>
          <Provider>
            <Header />
            {children}
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}
