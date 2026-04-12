import "./globals.css";
import Navbar from './components/Navbar.js';
import { AuthProvider } from './providers.js';

export const metadata = {
  title: "GovEase AI - Backend APIs",
  description: "AI-powered platform for Bangladesh government services access.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <AuthProvider>
          <Navbar />
          <main className="pt-4 pb-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

