"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function PreRegisterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("pre_registrations")
        .insert({ email });

      if (error) throw error;
      
      setSuccess(true);
      setEmail("");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="backdrop-blur-2xl bg-gradient-to-br from-[#FF0052]/20 via-[#ff4d7d]/10 to-[#FF0052]/20 border-2 border-[#FF0052]/50 rounded-3xl p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-[#f5f5f5] text-2xl font-black mb-4">You&apos;re on the list!</h3>
        <p className="text-[#f5f5f5]/80 text-lg">
          We&apos;ll notify you as soon as PredictionLive goes live. Get ready to predict!
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-2xl bg-gradient-to-br from-[#f5f5f5]/10 via-[#f5f5f5]/5 to-[#f5f5f5]/10 border border-[#f5f5f5]/20 rounded-3xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-[#f5f5f5] text-3xl font-black mb-4">
          Be First to Predict
        </h3>
        <p className="text-[#f5f5f5]/80 text-lg">
          Get early access to the future of real-time gaming predictions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#f5f5f5]/10 border-[#f5f5f5]/30 text-[#f5f5f5] placeholder:text-[#f5f5f5]/50 focus:border-[#FF0052] focus:ring-[#FF0052] rounded-2xl h-14 text-lg"
          />
        </div>

        {error && (
          <div className="text-[#FF0052] text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FF0052] via-[#ff4d7d] to-[#FF0052] text-[#f5f5f5] font-bold text-lg h-14 rounded-2xl hover:scale-105 transition-all duration-500 transform hover:-translate-y-1 shadow-2xl hover:shadow-[#FF0052]/50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-[#f5f5f5] border-t-transparent rounded-full animate-spin"></div>
              Joining...
            </div>
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </form>

      <p className="text-[#f5f5f5]/60 text-sm text-center mt-6">
        No spam, just updates when we launch! 🚀
      </p>
    </div>
  );
} 