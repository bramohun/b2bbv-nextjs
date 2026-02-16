'use client';

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== 'admin') {
                router.push("/dashboard");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-base-content">Adminisztrációs felület</h1>
                <p className="text-base-content/60">Rendszerfelhasználók, gyógyszertárak és a közösségi fórum kezelése</p>
            </div>

            <div role="tablist" className="tabs tabs-lifted">
                <Link
                    role="tab"
                    className={`tab ${pathname.includes('/users') || pathname === '/admin' ? 'tab-active' : ''}`}
                    href="/admin/users"
                >
                    Felhasználók
                </Link>
                <Link
                    role="tab"
                    className={`tab ${pathname.includes('/pharmacies') ? 'tab-active' : ''}`}
                    href="/admin/pharmacies"
                >
                    Gyógyszertárak
                </Link>
                <Link
                    role="tab"
                    className={`tab ${pathname.includes('/forum') ? 'tab-active' : ''}`}
                    href="/admin/forum"
                >
                    Fórum Moderálás
                </Link>
            </div>

            <div className="bg-base-100 p-6 rounded-b-box border-base-300 border-x border-b">
                {children}
            </div>
        </div>
    );
}
