import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setUser({ email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Top Navigation */}
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex gap-6">
          <Link href="/drive" className="hover:underline">
            My Drive
          </Link>
          <Link href="/trash" className="hover:underline">
            Trash
          </Link>
          <Link href="/shared" className="hover:underline">
            Shared with Me
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Page Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
