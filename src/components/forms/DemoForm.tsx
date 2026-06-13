"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarDays, Clock, User, Sparkles, ChevronRight, Check } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    businessName: z.string().min(2, {
        message: "Business name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    message: z.string().optional(),
});

export function DemoForm() {
    const [step, setStep] = useState<"details" | "scheduler">("details");
    const [contactDetails, setContactDetails] = useState<z.infer<typeof formSchema> | null>(null);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            businessName: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    const timeSlots = [
        { id: "slot1", date: "Tomorrow", time: "10:00 AM", label: "Morning walk-through" },
        { id: "slot2", date: "Tomorrow", time: "2:00 PM", label: "Reputation strategy call" },
        { id: "slot3", date: "Friday", time: "11:00 AM", label: "Agency growth custom walkthrough" },
    ];

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Log contact details in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("rms_demo_request", JSON.stringify(values));
        }
        setContactDetails(values);
        setStep("scheduler");
    }

    function handleSelectSlot(slot: typeof timeSlots[0]) {
        if (typeof window !== "undefined") {
            const finalData = {
                ...contactDetails,
                selectedSlot: slot
            };
            localStorage.setItem("rms_demo_completed", JSON.stringify(finalData));
            // Trigger redirection to confirmation
            router.push(`/demo/confirmation?date=${encodeURIComponent(slot.date)}&time=${encodeURIComponent(slot.time)}&name=${encodeURIComponent(contactDetails?.name || "")}`);
        }
    }

    if (step === "scheduler") {
        return (
            <div className="space-y-6 animate-slide-up">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-2">
                        <CalendarDays className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Select a Demo Slot</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Hi {contactDetails?.name}, choose a convenient mock schedule to explore our platform live with an expert.
                    </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-900">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot.id}
                            onClick={() => handleSelectSlot(slot)}
                            className="w-full text-left p-4.5 rounded-xl border border-white/5 bg-slate-950/40 hover:bg-violet-950/10 hover:border-violet-500/40 transition-all flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                                    <Clock className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        {slot.date} at {slot.time}
                                    </div>
                                    <div className="text-[11px] text-slate-500">{slot.label}</div>
                                </div>
                            </div>
                            <ChevronRight className="w-4.5 h-4.5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setStep("details")}
                    className="w-full py-2.5 rounded-xl border border-slate-900 text-xs text-slate-500 text-center hover:text-white transition-colors"
                >
                    ← Edit Contact Details
                </button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold text-slate-400">Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" className="bg-slate-950/40 border-slate-900 rounded-xl" {...field} />
                                </FormControl>
                                <FormMessage className="text-xs text-rose-400 mt-1" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold text-slate-400">Business Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Acme Inc." className="bg-slate-950/40 border-slate-900 rounded-xl" {...field} />
                                </FormControl>
                                <FormMessage className="text-xs text-rose-400 mt-1" />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-400">Work Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" className="bg-slate-950/40 border-slate-900 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs text-rose-400 mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-400">Mobile Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="(555) 123-4567" className="bg-slate-950/40 border-slate-900 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs text-rose-400 mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-400">Message (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us about your organization..."
                                    className="resize-none bg-slate-950/40 border-slate-900 rounded-xl h-20 text-xs"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-rose-400 mt-1" />
                        </FormItem>
                    )}
                />
                <button 
                    type="submit" 
                    className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer"
                >
                    Continue to Scheduler →
                </button>
            </form>
        </Form>
    );
}
