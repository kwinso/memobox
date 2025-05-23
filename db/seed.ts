import { faker } from "@faker-js/faker";
import { format } from "date-fns";

import { albums, memories, memoryUploads } from "./schema";

import { db } from ".";

async function cleanup() {
  await db.delete(albums);
}

const images = [
  "https://farm3.staticflickr.com/2220/1572613671_7311098b76_z_d.jpg",
  "https://farm7.staticflickr.com/6089/6115759179_86316c08ff_z_d.jpg",
  "https://farm4.staticflickr.com/3224/3081748027_0ee3d59fea_z_d.jpg",
  "https://farm2.staticflickr.com/1090/4595137268_0e3f2b9aa7_z_d.jpg",
];

async function main() {
  // eslint-disable-next-line  no-console
  console.info("Cleaning up...");
  await cleanup();

  // check if only drop is needed
  const drop = process.argv.includes("--drop");

  if (drop) {
    // eslint-disable-next-line  no-console
    console.log("Only drop requested, exiting...");

    return;
  }

  const albumCount = 3;

  // eslint-disable-next-line  no-console
  console.info(`Seeding ${albumCount} albums...`);
  for (let i = 0; i < albumCount; i++) {
    // Ading albums
    const album = await db
      .insert(albums)
      .values({
        title: faker.word.words(3),
        authorId: process.env.SEED_AUTHOR_ID!,
        createdAt: faker.date.recent(),
      })
      .returning();

    const memoriesCount = faker.number.int({ min: 8, max: 15 });

    for (let j = 0; j < memoriesCount; j++) {
      const newYorkLocaiton: [latitude: number, longitude: number] = [43, -79];
      const [lat, long] = faker.location.nearbyGPSCoordinate({
        origin: newYorkLocaiton,
        radius: 10,
      });

      // Adding memories
      const memory = await db
        .insert(memories)
        .values({
          caption: faker.lorem.sentence(),
          date: faker.date.recent(),
          authorId: process.env.SEED_AUTHOR_ID!,
          albumId: album[0].id,
          latitude: lat,
          longitude: long,
        })
        .returning();

      const uploadsCount = faker.number.int({ min: 1, max: 3 });

      for (let k = 0; k < uploadsCount; k++) {
        await db
          .insert(memoryUploads)
          .values({
            memoryId: memory[0].id,
            time: format(faker.date.anytime(), "HH:mm"),
            uploadUrl: images[Math.floor(Math.random() * images.length)],
            isImage: true,
          })
          .returning();
      }
    }
  }
}

main();
