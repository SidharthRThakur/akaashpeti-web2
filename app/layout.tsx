// apps/web/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Akaash-Peti",
  description: "Google Drive clone - Akaash-Peti",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* top navbar */}
            <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-blue-600">Akaash-Peti</h1>
              </div>
              {/* right side can hold profile / actions */}
              <div id="top-actions"></div>
            </header>

            {/* main area with sidebar + content */}
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
