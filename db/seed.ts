import { db } from ".";
import { faker } from "@faker-js/faker";
import { albumsTable } from "./schema";

async function cleanup() {
  await db.delete(albumsTable);
}

async function main() {
  console.info("Cleaning up...");
  await cleanup();

  // check if only drop is needed
  const drop = process.argv.includes("--drop");
  if (drop) {
    console.log("Only drop requested, exiting...");
    return;
  }

  const albumCount = 3;
  console.info(`Seeding ${albumCount} albums...`);
  for (let i = 0; i < albumCount; i++) {
    await db.insert(albumsTable).values({
      title: faker.lorem.words(3),
      authorId: process.env.SEED_AUTHOR_ID!,
      createdAt: faker.date.recent(),
    });
  }
}

main();
