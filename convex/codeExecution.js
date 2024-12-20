import { ConvexError } from "convex/values";
import { mutation } from "./_generated/server";

export const saveExecution = mutation({
  args: {
    language,
    code,
    output,
    error,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not Authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user?.isPro && args.language != "javascript") {
      throw new ConvexError("Pro Subscription Required");
    }

    await ctx.db.insert("executions", {
      ...args,
      userId: identity.subject,
    });
  },
});
