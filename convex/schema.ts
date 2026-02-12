import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Recommendations table
  recommendations: defineTable({
    userId: v.string(), // Clerk user ID
    userName: v.string(), // Display name
    userImageUrl: v.optional(v.string()), // Profile image
    title: v.string(),
    genre: v.union(
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
    ),
    link: v.string(),
    blurb: v.string(),
    isStaffPick: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_genre", ["genre"])
    .index("by_created", ["createdAt"])
    .index("by_staff_pick", ["isStaffPick"]),

  // Users table for role management
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
});
