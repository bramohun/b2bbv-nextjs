'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * USER STORY:
 * Felhasználóként szeretnék visszajelzést kapni bizonyos műveletek után (pl. kedvenc eltávolítása),
 * és lehetőséget kapni a művelet visszavonására egy rövid időablakon belül.
 * 
 * FUNKCIÓK:
 * - Toast üzenetek megjelenítése egymás felett sorakozva.
 * - Időzített eltűnés (alapértelmezetten 10mp).
 * - Vizuális visszajelzés a hátralévő időről (státusz csík).
 * - Visszavonás (Undo) gomb támogatása.
 * - Manuális bezárás lehetősége.
 * 
 * MŰKÖDÉSI LOGIKA:
 * - A toastok egy globális context-ben vannak tárolva.
 * - Minden toast saját időzítővel rendelkezik.
 * - A progress bar animációja CSS-szel vagy JS-szel vezérelt.
 */

interface Toast {
    id: string;
    message: ReactNode;
    description?: string;
    onUndo?: () => void;
    duration?: number; // ms
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id, duration: toast.duration || 10000 };
        setToasts(prev => [...prev, newToast]);
        return id;
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full sm:w-auto">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
    const { id, message, onUndo, duration = 10000 } = toast;
    const [timeLeft, setTimeLeft] = useState(100);

    useEffect(() => {
        const startTime = Date.now();
        const endTime = startTime + duration;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            const percentage = (remaining / duration) * 100;
            setTimeLeft(percentage);

            if (remaining === 0) {
                clearInterval(interval);
                onRemove(id);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [id, duration, onRemove]);

    const handleUndo = () => {
        if (onUndo) onUndo();
        onRemove(id);
    };

    return (
        <div className="alert bg-base-100 shadow-lg border border-base-300 relative overflow-hidden animate-in slide-in-from-right duration-300 pr-10">
            <button
                onClick={() => onRemove(id)}
                className="btn btn-xs btn-circle btn-ghost absolute top-1 right-1"
                title="Bezárás"
            >
                <span className="material-symbols-rounded text-xs">close</span>
            </button>
            <div className="flex flex-col w-full gap-1 py-1">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-rounded text-warning">info</span>
                        <div className="text-sm font-medium">{message}</div>
                    </div>
                    {onUndo && (
                        <div className="flex items-center">
                            <button
                                onClick={handleUndo}
                                className="btn btn-xs btn-primary whitespace-nowrap"
                            >
                                Visszavonom
                            </button>
                        </div>
                    )}
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                    <div
                        className="h-full bg-primary transition-all duration-75 ease-linear"
                        style={{ width: `${timeLeft}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
