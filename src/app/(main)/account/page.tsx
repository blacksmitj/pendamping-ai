"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Settings } from "lucide-react"
import { ProfileTab } from "./components/profile-tab"
import { PasswordTab } from "./components/password-tab"
import { PreferencesTab } from "./components/preferences-tab"

export default function AkunPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto py-2">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-inter">Pengaturan Akun</h1>
                <p className="text-slate-500 font-medium">Kelola informasi profil, keamanan, dan preferensi aplikasi Anda.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-14 p-1.5 bg-slate-100/80 rounded-2xl mb-10 shadow-inner">
                    <TabsTrigger 
                        value="profile" 
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all h-full"
                    >
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-bold">Profil</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="password" 
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md transition-all h-full"
                    >
                        <Lock className="h-4 w-4 mr-2" />
                        <span className="font-bold">Password</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="preferences" 
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md transition-all h-full"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="font-bold">Preferensi</span>
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-0 focus-visible:outline-none ring-offset-background transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2">
                    <ProfileTab />
                </TabsContent>
                
                <TabsContent value="password" className="mt-0 focus-visible:outline-none ring-offset-background transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2">
                    <PasswordTab />
                </TabsContent>
                
                <TabsContent value="preferences" className="mt-0 focus-visible:outline-none ring-offset-background transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2">
                    <PreferencesTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
