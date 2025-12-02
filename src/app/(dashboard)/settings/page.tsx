"use client";

import { useState, useEffect } from "react";
import { useAuth, authService } from "@shared";
import { User, Bell, Shield, CreditCard, LogOut, Loader2 } from "lucide-react";

export default function SettingsPage() {
    const { user, profile, signOut } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: profile?.full_name || "",
        email: user?.email || ""
    });

    useEffect(() => {
        if (profile) {
            setProfileData({
                full_name: profile.full_name || "",
                email: user?.email || ""
            });
        }
    }, [profile, user]);

    const handleSaveProfile = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const { error } = await authService.updateProfile(user.id, {
                full_name: profileData.full_name,
            });

            if (error) throw error;
            window.alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            window.alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground flex items-center">
                        <User className="mr-2 h-5 w-5 text-primary" />
                        Profile Information
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Update your account's profile information and email address.
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                            <input
                                type="text"
                                value={profileData.full_name}
                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                            <input
                                type="email"
                                value={profileData.email}
                                disabled
                                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                            <input
                                type="text"
                                value={(profile as any)?.role || "User"}
                                disabled
                                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
                        <Bell className="mr-2 h-5 w-5 text-yellow-500" />
                        Notifications
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Email Notifications</span>
                            <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">SMS Alerts</span>
                            <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
                        <Shield className="mr-2 h-5 w-5 text-green-500" />
                        Security
                    </h3>
                    <button className="w-full text-left px-4 py-3 rounded-lg border border-input hover:bg-accent transition-colors text-sm mb-3">
                        Change Password
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg border border-input hover:bg-accent transition-colors text-sm">
                        Two-Factor Authentication
                    </button>
                </div>
            </div>

            <div className="flex justify-center pt-6">
                <button
                    onClick={() => signOut()}
                    className="flex items-center text-destructive hover:bg-destructive/10 px-6 py-3 rounded-lg transition-colors"
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out of All Devices
                </button>
            </div>
        </div>
    );
}
