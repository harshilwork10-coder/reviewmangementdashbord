import { Button } from "@/components/ui/button";
import { Bell, User, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Role } from "@/lib/store";

export function DashboardHeader() {
    const { user, changeSessionRole } = useAuth();

    const roleLabels: Record<Role, string> = {
        admin: "Super Admin",
        agency: "Agency Admin",
        owner: "Business Owner",
        manager: "Location Manager",
        readonly: "Read Only",
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[#080b14]/95 backdrop-blur supports-[backdrop-filter]:bg-[#080b14]/60">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
                {/* Real-time Role Switcher for Testing */}
                {user && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                        <span className="text-primary font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Testing Role:
                        </span>
                        <select
                            value={user.role}
                            onChange={(e) => changeSessionRole(e.target.value as Role)}
                            className="bg-transparent border-none text-white font-medium focus:ring-0 focus:outline-none cursor-pointer"
                        >
                            {(Object.keys(roleLabels) as Role[]).map((r) => (
                                <option key={r} value={r} className="bg-[#0f172a] text-white">
                                    {roleLabels[r]}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
                <div className="flex items-center gap-2 pl-4 border-l border-border/40">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-medium text-white">{user?.name || "Demo User"}</span>
                        <span className="text-xs text-muted-foreground">{user ? roleLabels[user.role] : "Guest"}</span>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-muted">
                        <User className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
