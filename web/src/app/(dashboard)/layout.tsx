'use client';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - IRÁNYÍTÓPULT LAYOUT KERET
 * ============================================================================
 * 
 * MIRE HASZNÁLJUK:
 * A bejelentkezett felhasználók központi keretstruktúrája (Layout).
 * Biztosítja az autentikációs ellenőrzést, a globális kontextusokat
 * (Értesítések, Kedvencek, Közeli Patika, Toast), valamint a Figma tervek szerinti
 * egységes Fejlécet (Navbar) és Láblécet (Footer).
 * 
 * KAPCSOLÓDÓ USER STORY-K:
 * - Bejelentkezett orvosként / szakemberként egységes, biztonságos és reszponzív
 *   felületen szeretném használni a portál szolgáltatásait.
 * 
 * KAPCSOLÓDÓ FUNKCIÓK ÉS FELÜLETEK:
 * - Fejléc (Navbar)
 * - Lábléc (Footer)
 * - Bejelentkezés ellenőrzés (/login átirányítás)
 * ============================================================================
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotificationProvider } from "@/context/NotificationContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { ToastProvider } from "@/context/ToastContext";
import { NearbyPharmacyProvider } from "@/context/NearbyPharmacyContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, checkAuth } = useAuth();
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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="loading loading-spinner loading-lg text-[#002664]"></span>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <ToastProvider>
            <NearbyPharmacyProvider>
                <FavoriteProvider>
                    <NotificationProvider>
                        <div className="min-h-screen flex flex-col bg-white">
                            <Navbar />
                            <main className="w-full flex-1">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </NotificationProvider>
                </FavoriteProvider>
            </NearbyPharmacyProvider>
        </ToastProvider>
    );
}
