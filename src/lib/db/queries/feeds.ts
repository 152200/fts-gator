import { db } from "../index.js";
import { feeds, users } from "../schema.js";
import { asc, eq, sql } from "drizzle-orm";

export async function createFeed(
  name: string,
  url: string,
  userId: string,
) {
  const [feed] = await db
    .insert(feeds)
    .values({
      name,
      url,
      userId,
    })
    .returning();

  return feed;
}

export async function getFeeds() {
  return await db
    .select({
      id: feeds.id,
      name: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
}

export async function markFeedFetched(feedId: string) {
  const [feed] = await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();

  return feed;
}

export async function getNextFeedToFetch() {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(
      sql`${feeds.lastFetchedAt} ASC NULLS FIRST`,
    )
    .limit(1);

  return feed;
}
