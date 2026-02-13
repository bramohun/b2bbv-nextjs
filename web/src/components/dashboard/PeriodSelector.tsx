'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function PeriodSelector({ period }: { period: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value;
        const params = new URLSearchParams(searchParams);
        params.set('period', newPeriod);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-base-content/70">Időszak:</label>
            <select
                className="select select-bordered select-sm"
                value={period}
                onChange={handleChange}
            >
                <option value={1}>Elmúlt 1 nap (Mai)</option>
                <option value={3}>Elmúlt 3 nap</option>
                <option value={7}>Elmúlt 1 hét</option>
                <option value={14}>Elmúlt 2 hét</option>
                <option value={30}>Elmúlt 1 hónap</option>
            </select>
        </div>
    );
}
