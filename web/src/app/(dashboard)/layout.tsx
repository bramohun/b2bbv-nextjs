import { Navbar } from "@/components/layout/Navbar";
import { NotificationProvider } from "@/context/NotificationContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <div className="min-h-screen bg-base-200">
                <Navbar />
                <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </NotificationProvider>
    );
}
