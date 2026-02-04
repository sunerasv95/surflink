"use client";

import { useState, useMemo } from "react";
import { submitWaitlist } from "./actions";

const SURF_BREAKS = [
  {
    region: "South Coast",
    breaks: [
      "Weligama Bay",
      "Midigama",
      "Lazy Left (Midigama)",
      "Rams Right (Midigama)",
      "Plantation Point",
      "Coconut Tree Hill",
      "Mirissa",
      "Ahangama",
      "Kabalana Beach",
      "The Rock",
      "Marshmallows",
      "Dewata",
      "Dalawella",
      "Unawatuna",
    ],
  },
  {
    region: "East Coast",
    breaks: [
      "Arugam Bay – Main Point",
      "Baby Point",
      "Peanut Farm",
      "Whiskey Point",
      "Elephant Rock",
      "Crocodile Rock",
      "Okanda",
    ],
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [homeBreak, setHomeBreak] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isFocused, setIsFocused] = useState(false);

  const filteredBreaks = useMemo(() => {
    if (!homeBreak) return SURF_BREAKS;

    return SURF_BREAKS.map(group => ({
      ...group,
      breaks: group.breaks.filter(b => b.toLowerCase().includes(homeBreak.toLowerCase()))
    })).filter(group => group.breaks.length > 0);
  }, [homeBreak]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const result = await submitWaitlist(email, homeBreak);

    if (result.status === "success") {
      setStatus("success");
      setEmail("");
      setHomeBreak("");
    } else {
      setStatus("error");
      console.error(result.message);
      // Optionally handle error state UI here
      alert(result.message); // Simple feedback for now
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col relative overflow-hidden">
      {/* Subtle Background Texture/Overlay - mimicking ocean mist/grain */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-ocean)_0%,_transparent_70%)] blur-[120px] -translate-y-1/2" />

      {/* Navigation / Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex justify-center">
        <div className="flex items-center gap-2">
          {/* <div className="w-5 h-5 rounded-full border-2 border-foreground flex items-center justify-center">
            <span className="text-xl font-bold pb-1">~</span>
          </div> */}
          <span className="text-4xl font-black uppercase">SurfLink</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 pt-10 pb-20">

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-2 text-foreground">
          The Lineup
        </h1>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-ocean/60 italic font-serif">
          Is Forming.
        </h1>

        <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
          One platform to trade your quiver, find your local crew, and discover the best breaks, stays, and fuel.
        </p>

        {/* Waitlist Form */}
        <div className="mt-12 w-full max-w-4xl mx-auto">
          {status === "success" ? (
            <div className="bg-ocean/10 border border-ocean/20 text-ocean p-6 rounded-2xl animate-fade-in">
              <p className="font-semibold text-lg">You're in the lineup! 🤙</p>
              <p className="text-sm opacity-80">We'll let you know when the swell arrives in your area.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 p-2 bg-white/50 backdrop-blur-sm border border-black/5 rounded-3xl shadow-sm">
              <div className="flex-1 px-4 py-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-black/5 relative">
                <svg className="w-5 h-5 text-ocean/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Where do you usually surf?"
                    required
                    value={homeBreak}
                    onChange={(e) => setHomeBreak(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="w-full bg-transparent outline-none placeholder:text-foreground/40 text-foreground"
                  />
                  {isFocused && (
                    <div className="absolute top-full left-0 w-full md:w-[300px] mt-2 bg-white rounded-xl shadow-xl border border-black/5 max-h-[300px] overflow-y-auto z-50">
                      {filteredBreaks.length > 0 ? (
                        filteredBreaks.map((group) => (
                          <div key={group.region}>
                            <div className="px-4 py-2 bg-sand text-xs font-bold text-foreground/50 uppercase tracking-wider sticky top-0">
                              {group.region}
                            </div>
                            {group.breaks.map((breakName) => (
                              <button
                                key={breakName}
                                type="button"
                                onClick={() => {
                                  setHomeBreak(breakName);
                                  setIsFocused(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-ocean/10 text-sm transition-colors text-foreground/80 hover:text-ocean"
                              >
                                {breakName}
                              </button>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-foreground/50 italic">
                          No local spots found. Type to add usually...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 px-4 py-3 flex items-center gap-3">
                <svg className="w-5 h-5 text-ocean/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-foreground/40 text-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-foreground text-sand font-bold px-8 py-4 rounded-2xl hover:bg-ocean transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
              >
                {status === "loading" ? "Joining..." : <>JOIN <span className="text-lg">→</span></>}
              </button>
            </form>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full max-w-6xl px-4">
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            title="Trade Gear"
            desc="Buy, sell, or rent high-performance boards and accessories from locals."
          />
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            title="Find Breaks"
            desc="Discover hidden local spots with real-time community insights on vibes."
          />
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            title="Your Crew"
            desc="Connect with surf buddies who match your skill level. Never paddle out alone."
          />
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            title="Local Fuel"
            desc="Find the best post-surf coffee, burritos, and stays vetted by the community."
          />
        </div>
      </main>

      <footer className="w-full py-8 text-center text-foreground/40 text-sm">
        <p>&copy; {new Date().getFullYear()} SurfLink. Regional Surf Network.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 bg-sand rounded-xl flex items-center justify-center mb-4 text-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-foreground/70 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}
