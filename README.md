# Gator

Gator is a command-line RSS feed aggregator built with **TypeScript**, **PostgreSQL**, and **Drizzle ORM**.

It allows users to:

- Register and log in
- Add RSS feeds
- Follow and unfollow feeds
- View feeds they're following
- Scrape RSS feeds periodically
- Store RSS posts in PostgreSQL
- Browse the latest posts from followed feeds

## Tech Stack

- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM
- `tsx`
- `fast-xml-parser`

## Requirements

Make sure you have:

- Node.js
- PostgreSQL
- npm

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a PostgreSQL database and configure Gator using:

```bash
npm run start register <username>
```

The application stores its configuration in:

```text
~/.gatorconfig.json
```

The configuration contains the database URL and the currently logged-in user.

## Database

Gator uses PostgreSQL to store:

- Users
- RSS feeds
- Feed follows
- Posts

The main relationships are:

```text
User
  │
  └── Feed Follows
          │
          └── Feed
                │
                └── Posts
```

### Main Tables

#### `users`

Stores application users.

#### `feeds`

Stores RSS feeds and the user who created them.

#### `feed_follows`

Stores which users follow which feeds.

A user can follow many feeds, and a feed can be followed by many users.

#### `posts`

Stores individual posts retrieved from RSS feeds.

Each post belongs to one feed and has a unique URL.

## Commands

### Register

Create a new user and log in automatically:

```bash
npm run start register <username>
```

Example:

```bash
npm run start register kahya
```

### Login

Switch the currently logged-in user:

```bash
npm run start login <username>
```

Example:

```bash
npm run start login kahya
```

### Users

Display all registered users:

```bash
npm run start users
```

### Reset

Delete all users and reset the database data:

```bash
npm run start reset
```

### Add Feed

Add a new RSS feed.

```bash
npm run start addfeed <name> <url>
```

Example:

```bash
npm run start addfeed "Hacker News" https://hnrss.org/newest
```

When a feed is added, the current user automatically follows it.

### Feeds

Display all RSS feeds:

```bash
npm run start feeds
```

### Follow

Follow an existing feed:

```bash
npm run start follow <url>
```

Example:

```bash
npm run start follow https://hnrss.org/newest
```

### Following

Display the feeds followed by the current user:

```bash
npm run start following
```

### Unfollow

Stop following a feed:

```bash
npm run start unfollow <url>
```

Example:

```bash
npm run start unfollow https://hnrss.org/newest
```

## Feed Aggregator

The `agg` command periodically fetches RSS feeds and stores their posts in the database.

```bash
npm run start agg <duration>
```

Supported duration units:

- `ms` — milliseconds
- `s` — seconds
- `m` — minutes
- `h` — hours

Examples:

```bash
npm run start agg 1s
```

```bash
npm run start agg 1m
```

```bash
npm run start agg 1h
```

The aggregator immediately fetches a feed and then continues fetching feeds according to the specified interval.

Press:

```text
Ctrl + C
```

to stop the aggregator.

## Browse Posts

Display the latest posts from feeds followed by the current user:

```bash
npm run start browse
```

By default, `browse` displays the latest **2 posts**.

You can specify the number of posts:

```bash
npm run start browse 10
```

Posts are displayed with their:

- Title
- URL
- Published date
- Feed name

## Example Workflow

Register a user:

```bash
npm run start register kahya
```

Add a feed:

```bash
npm run start addfeed "Hacker News" https://hnrss.org/newest
```

Check followed feeds:

```bash
npm run start following
```

Start the aggregator:

```bash
npm run start agg 10s
```

After the aggregator has collected some posts, stop it with:

```text
Ctrl + C
```

Then browse the latest posts:

```bash
npm run start browse
```

Or request more posts:

```bash
npm run start browse 10
```

## RSS Feed Parsing

Gator fetches RSS feeds using the built-in `fetch` API and parses XML using `fast-xml-parser`.

Each RSS item is converted into a post containing:

- Title
- URL
- Description
- Published date
- Feed ID

Published dates are parsed into JavaScript `Date` objects before being stored in PostgreSQL.

## Duplicate Posts

Post URLs are unique in the database.

If the aggregator encounters a post that has already been stored, the duplicate is ignored instead of creating another record.

This allows the aggregator to repeatedly scrape feeds without creating duplicate posts.

## Project Structure

```text
src/
├── index.ts
├── rss.ts
├── config.ts
└── lib/
    └── db/
        ├── index.ts
        ├── schema.ts
        └── queries/
            ├── users.ts
            ├── feeds.ts
            ├── feedFollows.ts
            └── posts.ts
```

## Development

Run the application using:

```bash
npm run start <command>
```

Examples:

```bash
npm run start users
npm run start feeds
npm run start following
npm run start browse
```

For development, `tsx` allows the TypeScript source files to be executed directly without manually compiling them first.

## License

This project was created as part of the Boot.dev backend development curriculum.
