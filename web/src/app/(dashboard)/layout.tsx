'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { NotificationProvider } from "@/context/NotificationContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { ToastProvider } from "@/context/ToastContext";
import { NearbyPharmacyProvider } from "@/context/NearbyPharmacyContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, user, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <ToastProvider>
            <NearbyPharmacyProvider>
                <FavoriteProvider>
                    <NotificationProvider>
                        <div className="min-h-screen bg-base-200">
                            <Navbar />
                            <main className="w-full p-4 md:p-6 lg:p-8">
                                {children}
                            </main>
                        </div>
                    </NotificationProvider>
                </FavoriteProvider>
            </NearbyPharmacyProvider>
        </ToastProvider>
    );
}
