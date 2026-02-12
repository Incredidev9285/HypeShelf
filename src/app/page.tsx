"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

const genreClasses: Record<string, string> = {
  horror: "genre-horror",
  action: "genre-action",
  comedy: "genre-comedy",
  drama: "genre-drama",
  "sci-fi": "genre-sci-fi",
  romance: "genre-romance",
  thriller: "genre-thriller",
  documentary: "genre-documentary",
  animation: "genre-animation",
  other: "genre-other",
};

export default function Home() {
  const latestRecs = useQuery(api.recommendations.getLatestPublic, { limit: 6 });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-xl tracking-tight">HypeShelf</span>
          </div>
          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-secondary text-sm">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn-secondary text-sm">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--accent-primary)] opacity-10 blur-[100px] rounded-full" />
            <div className="absolute top-40 right-1/4 w-80 h-80 bg-[var(--accent-secondary)] opacity-10 blur-[100px] rounded-full" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
                <span className="gradient-text">Collect & Share</span>
                <br />
                What You&apos;re Hyped About
              </h1>
              <p className="text-xl text-[var(--foreground-muted)] mb-10 animate-fade-in-delay-1">
                Your friends have great taste. Discover their favorite movies, shows, and hidden gems all in one beautiful shelf.
              </p>
              <div className="flex items-center justify-center gap-4 animate-fade-in-delay-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="btn-primary text-lg px-8 py-4 animate-pulse-glow">
                      Sign In to Add Yours
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                    Go to Dashboard
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Recommendations Section */}
        <section className="relative py-20 border-t border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Latest Recommendations</h2>
                <p className="text-[var(--foreground-muted)]">
                  Fresh picks from the community
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                <span className="w-2 h-2 bg-[var(--accent-success)] rounded-full animate-pulse" />
                Live updates
              </div>
            </div>

            {latestRecs === undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-6 bg-[var(--background-tertiary)] rounded w-3/4 mb-3" />
                    <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/4 mb-4" />
                    <div className="h-16 bg-[var(--background-tertiary)] rounded mb-4" />
                    <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : latestRecs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
                <p className="text-[var(--foreground-muted)] mb-6">
                  Be the first to share something you&apos;re hyped about!
                </p>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="btn-primary">Sign In to Add</button>
                  </SignInButton>
                </SignedOut>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestRecs.map((rec, index) => (
                  <article
                    key={rec._id}
                    className="glass-card p-6 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {rec.title}
                      </h3>
                      {rec.isStaffPick && (
                        <span className="staff-pick-badge ml-2 flex-shrink-0">
                          ⭐ Staff Pick
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`genre-badge ${genreClasses[rec.genre]}`}>
                        {rec.genre}
                      </span>
                    </div>
                    <p className="text-[var(--foreground-muted)] text-sm mb-4 line-clamp-3">
                      {rec.blurb}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-2">
                        {rec.userImageUrl ? (
                          <img
                            src={rec.userImageUrl}
                            alt={rec.userName}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center text-xs">
                            {rec.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm text-[var(--foreground-muted)]">
                          {rec.userName}
                        </span>
                      </div>
                      <a
                        href={rec.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--accent-secondary)] hover:underline"
                      >
                        View →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="font-semibold text-lg mb-2">Share Your Favorites</h3>
                <p className="text-[var(--foreground-muted)] text-sm">
                  Add movies, shows, and content you love with a quick description.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-lg mb-2">Discover by Genre</h3>
                <p className="text-[var(--foreground-muted)] text-sm">
                  Filter recommendations by genre to find exactly what you&apos;re in the mood for.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-semibold text-lg mb-2">Staff Picks</h3>
                <p className="text-[var(--foreground-muted)] text-sm">
                  Look out for curated Staff Picks—the cream of the crop.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-[var(--foreground-muted)] text-sm">
          <p>© 2026 HypeShelf. Built with Next.js, Clerk & Convex.</p>
        </div>
      </footer>
    </div>
  );
}
