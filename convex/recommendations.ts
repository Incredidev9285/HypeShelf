import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const genreValidator = v.union(
  v.literal("horror"),
  v.literal("action"),
  v.literal("comedy"),
  v.literal("drama"),
  v.literal("sci-fi"),
  v.literal("romance"),
  v.literal("thriller"),
  v.literal("documentary"),
  v.literal("animation"),
  v.literal("other")
);

// Get latest public recommendations (for landing page)
export const getLatestPublic = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    return await ctx.db
      .query("recommendations")
      .order("desc")
      .take(limit);
  },
});

// Get all recommendations with optional genre filter
export const getAll = query({
  args: { 
    genre: v.optional(genreValidator),
    staffPicksOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Handle different filter cases
    if (args.staffPicksOnly) {
      return await ctx.db
        .query("recommendations")
        .withIndex("by_staff_pick", (q) => q.eq("isStaffPick", true))
        .order("desc")
        .collect();
    }
    
    if (args.genre) {
      const genre = args.genre;
      return await ctx.db
        .query("recommendations")
        .withIndex("by_genre", (q) => q.eq("genre", genre))
        .order("desc")
        .collect();
    }

    // No filter - return all
    return await ctx.db
      .query("recommendations")
      .order("desc")
      .collect();
  },
});

// Create a new recommendation
export const create = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    genre: genreValidator,
    link: v.string(),
    blurb: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found. Please sign in again.");
    }

    // Validate inputs
    if (args.title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (args.blurb.trim().length === 0) {
      throw new Error("Blurb is required");
    }
    if (args.blurb.length > 500) {
      throw new Error("Blurb must be 500 characters or less");
    }

    // Basic URL validation
    try {
      new URL(args.link);
    } catch {
      throw new Error("Please provide a valid URL");
    }

    const recommendationId = await ctx.db.insert("recommendations", {
      userId: args.clerkId,
      userName: user.name,
      userImageUrl: user.imageUrl,
      title: args.title.trim(),
      genre: args.genre,
      link: args.link.trim(),
      blurb: args.blurb.trim(),
      isStaffPick: false,
      createdAt: Date.now(),
    });

    return recommendationId;
  },
});

// Delete a recommendation (user can delete own, admin can delete any)
export const remove = mutation({
  args: {
    clerkId: v.string(),
    recommendationId: v.id("recommendations"),
  },
  handler: async (ctx, args) => {
    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the recommendation
    const recommendation = await ctx.db.get(args.recommendationId);

    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    // Check authorization: user can delete own, admin can delete any
    const isOwner = recommendation.userId === args.clerkId;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("Unauthorized: You can only delete your own recommendations");
    }

    await ctx.db.delete(args.recommendationId);

    return { success: true };
  },
});

// Admin only: Toggle staff pick status
export const toggleStaffPick = mutation({
  args: {
    clerkId: v.string(),
    recommendationId: v.id("recommendations"),
  },
  handler: async (ctx, args) => {
    // Get the user and verify admin role
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can mark staff picks");
    }

    // Get the recommendation
    const recommendation = await ctx.db.get(args.recommendationId);

    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    // Toggle the staff pick status
    await ctx.db.patch(args.recommendationId, {
      isStaffPick: !recommendation.isStaffPick,
    });

    return { success: true, isStaffPick: !recommendation.isStaffPick };
  },
});

// Get user's own recommendations
export const getByUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.clerkId))
      .order("desc")
      .collect();
  },
});
