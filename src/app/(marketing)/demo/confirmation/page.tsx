"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, CheckCircle, Calendar, Video, Clock, Users, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "Tomorrow";
  const time = searchParams.get("time") || "10:00 AM";
  const name = searchParams.get("name") || "Valued Client";

  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden flex flex-col items-center justify-center py-24 px-4 noise-overlay">
      <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full">
        {/* Glow Ring */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-xl opacity-20" />

        {/* Confirmation Card */}
        <div className="relative glass-card border border-white/10 rounded-2xl p-8 bg-slate-950/80 shadow-2xl text-center space-y-6">
          
          {/* Success Check badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <CheckCircle className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Demo Booked Successfully!</h1>
            <p className="text-sm text-slate-400">
              Hi {name}, your video call credentials have been generated and sent to your email.
            </p>
          </div>

          {/* Booking Summary details grid */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-4 text-left">
            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-300">
              <Calendar className="w-5 h-5 text-violet-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Date & Time</span>
                <span className="font-bold text-white">{date} at {time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-300">
              <Video className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Conference Platform</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  Google Meet
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 uppercase font-bold">Generated</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-300">
              <Users className="w-5 h-5 text-violet-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Host Organizer</span>
                <span className="font-semibold text-white">ReviewManagement Success Expert</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-900">
            <button 
              onClick={() => alert("Added to calendar! (Simulation)")}
              className="w-full py-3 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              Add to Google Calendar
            </button>
            
            <Link 
              href="/register" 
              className="btn-primary w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 group"
            >
              Start Free Trial in Parallel
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors">
              Return to Homepage
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function DemoConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center text-white">
        Loading confirmation...
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
