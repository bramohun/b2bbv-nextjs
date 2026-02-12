'use client';

import React, { useEffect, useState } from 'react';
import { Medicine, Pharmacy } from '@/types';
import { ForumTopic } from '@/types/forum';
import { StockChangesWidget } from '@/components/dashboard/StockChangesWidget';
import { CommunityActivityWidget } from '@/components/dashboard/CommunityActivityWidget';
import { PharmacyStockWidget } from '@/components/dashboard/PharmacyStockWidget';

export default function DashboardPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [forumActivity, setForumActivity] = useState<ForumTopic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [medRes, pharmRes, forumRes] = await Promise.all([
                    fetch('/api/medicines'),
                    fetch('/api/pharmacies'),
                    fetch('/api/forum/activity')
                ]);

                if (medRes.ok) setMedicines(await medRes.json());
                if (pharmRes.ok) setPharmacies(await pharmRes.json());
                if (forumRes.ok) setForumActivity(await forumRes.json());
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="material-symbols-rounded text-primary text-4xl">dashboard</span>
                Irányítópult
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Medicine Stock Changes */}
                <div className="lg:col-span-1">
                    <StockChangesWidget medicines={medicines} />
                </div>

                {/* Middle Column: Pharmacy Activity */}
                <div className="lg:col-span-1">
                    <PharmacyStockWidget medicines={medicines} pharmacies={pharmacies} />
                </div>

                {/* Right Column: Community Activity */}
                <div className="lg:col-span-1">
                    <CommunityActivityWidget activities={forumActivity.slice(0, 5)} />
                </div>
            </div>
        </div>
    );
}
