"use client";

import { useState } from "react";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";

type Genre =
  | "horror"
  | "action"
  | "comedy"
  | "drama"
  | "sci-fi"
  | "romance"
  | "thriller"
  | "documentary"
  | "animation"
  | "other";

const genres: Genre[] = [
  "horror",
  "action",
  "comedy",
  "drama",
  "sci-fi",
  "romance",
  "thriller",
  "documentary",
  "animation",
  "other",
];

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

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [staffPicksOnly, setStaffPicksOnly] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<Genre>("comedy");
  const [link, setLink] = useState("");
  const [blurb, setBlurb] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Convex queries and mutations
  const currentUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const recommendations = useQuery(api.recommendations.getAll, {
    genre: selectedGenre ?? undefined,
    staffPicksOnly: staffPicksOnly || undefined,
  });
  const createRecommendation = useMutation(api.recommendations.create);
  const deleteRecommendation = useMutation(api.recommendations.remove);
  const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    setError("");

    try {
      await createRecommendation({
        clerkId: user.id,
        title,
        genre,
        link,
        blurb,
      });
      // Reset form
      setTitle("");
      setGenre("comedy");
      setLink("");
      setBlurb("");
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add recommendation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (recommendationId: Id<"recommendations">) => {
    if (!user?.id) return;
    if (!confirm("Are you sure you want to delete this recommendation?")) return;

    try {
      await deleteRecommendation({
        clerkId: user.id,
        recommendationId,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleToggleStaffPick = async (recommendationId: Id<"recommendations">) => {
    if (!user?.id) return;

    try {
      await toggleStaffPick({
        clerkId: user.id,
        recommendationId,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update staff pick");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--foreground-muted)]">Loading...</div>
      </div>
    );
  }

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🔥</span>
              <span className="font-bold text-xl tracking-tight">HypeShelf</span>
            </Link>
            {isAdmin && (
              <span className="px-2 py-1 bg-[var(--accent-tertiary)]/20 text-[var(--accent-tertiary)] text-xs font-semibold rounded-md uppercase tracking-wider">
                Admin
              </span>
            )}
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary text-sm"
            >
              + Add Recommendation
            </button>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-[var(--foreground-muted)]">
              Browse recommendations or add your own favorites.
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card p-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-[var(--foreground-muted)]">Filter by:</span>
              
              {/* Genre Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedGenre(null);
                    setStaffPicksOnly(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    !selectedGenre && !staffPicksOnly
                      ? "bg-[var(--accent-primary)] text-white"
                      : "bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setSelectedGenre(null);
                    setStaffPicksOnly(true);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    staffPicksOnly
                      ? "bg-[var(--accent-tertiary)] text-black"
                      : "bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  ⭐ Staff Picks
                </button>
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGenre(g);
                      setStaffPicksOnly(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedGenre === g
                        ? "bg-[var(--accent-secondary)] text-white"
                        : "bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          {recommendations === undefined ? (
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
          ) : recommendations.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">No recommendations found</h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                {selectedGenre || staffPicksOnly
                  ? "Try a different filter or add the first one!"
                  : "Be the first to add a recommendation!"}
              </p>
              <button onClick={() => setShowAddForm(true)} className="btn-primary">
                Add Recommendation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => {
                const isOwner = rec.userId === user?.id;
                const canDelete = isOwner || isAdmin;

                return (
                  <article key={rec._id} className="glass-card p-6 group relative">
                    {/* Admin/Owner Actions */}
                    {(canDelete || isAdmin) && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isAdmin && (
                          <button
                            onClick={() => handleToggleStaffPick(rec._id)}
                            className={`p-2 rounded-lg transition-all ${
                              rec.isStaffPick
                                ? "bg-[var(--accent-tertiary)] text-black"
                                : "bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--accent-tertiary)]"
                            }`}
                            title={rec.isStaffPick ? "Remove Staff Pick" : "Mark as Staff Pick"}
                          >
                            ⭐
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(rec._id)}
                            className="p-2 rounded-lg bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3 pr-20">
                      <h3 className="font-semibold text-lg group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {rec.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`genre-badge ${genreClasses[rec.genre]}`}>
                        {rec.genre}
                      </span>
                      {rec.isStaffPick && (
                        <span className="staff-pick-badge">⭐ Staff Pick</span>
                      )}
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
                          {isOwner && (
                            <span className="ml-1 text-[var(--accent-secondary)]">(you)</span>
                          )}
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
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Recommendation Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          />
          
          {/* Modal */}
          <div className="relative glass-card p-8 w-full max-w-lg animate-fade-in">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">Add Recommendation</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Dune: Part Two"
                  required
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as Genre)}
                  className="input-field"
                  required
                >
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium mb-2">
                  Link *
                </label>
                <input
                  type="url"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="input-field"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label htmlFor="blurb" className="block text-sm font-medium mb-2">
                  Short Blurb * <span className="text-[var(--foreground-muted)]">({blurb.length}/500)</span>
                </label>
                <textarea
                  id="blurb"
                  value={blurb}
                  onChange={(e) => setBlurb(e.target.value)}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Why should people check this out?"
                  maxLength={500}
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Recommendation"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
