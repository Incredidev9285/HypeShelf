import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get or create user on sign in
export const getOrCreateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update user info if changed
      if (
        existingUser.email !== args.email ||
        existingUser.name !== args.name ||
        existingUser.imageUrl !== args.imageUrl
      ) {
        await ctx.db.patch(existingUser._id, {
          email: args.email,
          name: args.name,
          imageUrl: args.imageUrl,
        });
      }
      return existingUser;
    }

    // Create new user with default role
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      role: "user", // Default role
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

// Get current user
export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Admin only: Update user role
export const updateUserRole = mutation({
  args: {
    adminClerkId: v.string(),
    targetUserId: v.id("users"),
    newRole: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    // Verify the requester is an admin
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update roles");
    }

    await ctx.db.patch(args.targetUserId, {
      role: args.newRole,
    });

    return { success: true };
  },
});
