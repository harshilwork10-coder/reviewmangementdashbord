"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, authenticate, initStore, Location, getLocationsByBusiness, Role, ROLE_PERMISSIONS } from "./store";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    activeLocation: Location | null;
    setActiveLocation: (loc: Location | null) => void;
    availableLocations: Location[];
    changeSessionRole: (role: Role) => void;
    hasPermission: (action: "view" | "create" | "edit" | "delete" | "billing" | "user_management") => boolean;
    switchClientBusiness: (businessId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLocation, setActiveLocation] = useState<Location | null>(null);
    const [availableLocations, setAvailableLocations] = useState<Location[]>([]);

    useEffect(() => {
        initStore();
        const saved = sessionStorage.getItem("rms_current_user");
        if (saved) {
            try {
                const pUser = JSON.parse(saved);
                if (pUser.role === "agency") {
                    const activeClient = sessionStorage.getItem("rms_agency_active_business_id");
                    if (activeClient) {
                        pUser.businessId = activeClient;
                    }
                }
                setUser(pUser);
            } catch { /* ignore */ }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user && user.businessId) {
            const locs = getLocationsByBusiness(user.businessId);
            setAvailableLocations(locs);
            if (locs.length > 0) {
                // If they have a pref in storage, try to use it
                const savedLoc = sessionStorage.getItem("rms_active_location");
                if (savedLoc) {
                    const parsed = JSON.parse(savedLoc);
                    const match = locs.find(l => l.id === parsed.id);
                    setActiveLocation(match || locs[0]);
                } else {
                    setActiveLocation(locs[0]);
                }
            } else {
                setActiveLocation(null);
            }
        } else {
            setAvailableLocations([]);
            setActiveLocation(null);
        }
    }, [user]);

    const handleSetActiveLocation = (loc: Location | null) => {
        setActiveLocation(loc);
        if (loc) {
            sessionStorage.setItem("rms_active_location", JSON.stringify(loc));
        } else {
            sessionStorage.removeItem("rms_active_location");
        }
    };

    const changeSessionRole = (newRole: Role) => {
        if (!user) return;
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        sessionStorage.setItem("rms_current_user", JSON.stringify(updatedUser));
    };

    const hasPermission = (action: "view" | "create" | "edit" | "delete" | "billing" | "user_management"): boolean => {
        if (!user) return false;
        const perms = ROLE_PERMISSIONS[user.role];
        if (!perms) return false;
        switch (action) {
            case "view": return perms.canView;
            case "create": return perms.canCreate;
            case "edit": return perms.canEdit;
            case "delete": return perms.canDelete;
            case "billing": return perms.canManageBilling;
            case "user_management": return perms.canManageUsers;
            default: return false;
        }
    };

    const login = async (email: string, password: string) => {
        const found = authenticate(email, password);
        if (found) {
            setUser(found);
            sessionStorage.setItem("rms_current_user", JSON.stringify(found));
            return { success: true };
        }
        return { success: false, error: "Invalid email or password" };
    };

    const switchClientBusiness = (businessId: string | null) => {
        if (businessId) {
            sessionStorage.setItem("rms_agency_active_business_id", businessId);
        } else {
            sessionStorage.removeItem("rms_agency_active_business_id");
        }
        
        // Reload user state with updated businessId
        const saved = sessionStorage.getItem("rms_current_user");
        if (saved) {
            try {
                const pUser = JSON.parse(saved);
                if (businessId) {
                    pUser.businessId = businessId;
                } else {
                    delete pUser.businessId;
                }
                setUser(pUser);
            } catch { /* ignore */ }
        }
    };

    const logout = () => {
        setUser(null);
        setActiveLocation(null);
        setAvailableLocations([]);
        sessionStorage.removeItem("rms_current_user");
        sessionStorage.removeItem("rms_active_location");
        sessionStorage.removeItem("rms_agency_active_business_id");
    };

    return (
        <AuthContext.Provider value={{
            user, loading, login, logout,
            activeLocation, setActiveLocation: handleSetActiveLocation, availableLocations,
            changeSessionRole, hasPermission, switchClientBusiness
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
