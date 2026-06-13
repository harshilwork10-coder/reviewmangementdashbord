"use client";

import { useEffect, useState } from "react";
import { X, Mail, BookOpen, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if dismissed during the current session
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("rms_exit_intent_dismissed");
      if (dismissed) return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect when mouse leaves the top boundary of the viewport
      if (e.clientY < 20) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rms_exit_intent_dismissed", "true");
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (typeof window !== "undefined") {
      // Save subscription state
      localStorage.setItem("rms_lead_magnet_subscriber", email);
      // Increment subscriber counter simulation
      const count = Number(localStorage.getItem("rms_subscriber_leads_count") || "148");
      localStorage.setItem("rms_subscriber_leads_count", String(count + 1));
      
      // Keep dismissed state active
      sessionStorage.setItem("rms_exit_intent_dismissed", "true");
    }

    setIsSubscribed(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative max-w-md w-full bg-slate-950/90 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-violet-500/10 overflow-hidden text-center space-y-6 animate-slide-up">
        
        {/* Glow Orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-600/15 rounded-full blur-[50px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 bg-slate-900/60 text-slate-500 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {!isSubscribed ? (
          <>
            {/* Lead Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-2">
              <BookOpen className="w-6 h-6 animate-bounce" />
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl font-extrabold text-white leading-snug">
                Wait! Don't Leave<br />
                <span className="gradient-text">Empty-Handed.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Download our free eBook: <strong className="text-white">“The 2026 Local Business Reviews Playbook”</strong> and claim a <span className="text-emerald-400 font-bold">20% upgrade discount</span> on any plan.
              </p>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors placeholder:text-slate-600"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-600" />
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Send My Free eBook & Coupon
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-slate-600">
              We respect your privacy. Unsubscribe from marketing tips at any time.
            </p>
          </>
        ) : (
          <div className="space-y-6 py-4 animate-slide-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Your eBook is on its way!</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Check your inbox for the download link. In the meantime, use your custom discount code below at checkout:
              </p>
            </div>

            {/* Coupon display card */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 max-w-xs mx-auto">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-1">Coupon Discount Code</span>
              <div className="text-2xl font-black text-white font-mono tracking-wider">GROW20</div>
              <span className="text-[9px] text-slate-500 block mt-1">Saves 20% on any plan for 3 months</span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-slate-900 border border-white/5 text-xs text-slate-400 rounded-xl hover:text-white transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
