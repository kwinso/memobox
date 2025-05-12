import { db } from ".";
import { faker } from "@faker-js/faker";
import { albums, memories } from "./schema";

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
    // Ading albums
    const album = await db
      .insert(albums)
      .values({
        title: faker.word.words(3),
        authorId: process.env.SEED_AUTHOR_ID!,
        createdAt: faker.date.recent(),
      })
      .returning();

    const memoriesCount = faker.number.int({ min: 3, max: 5 });
    for (let j = 0; j < memoriesCount; j++) {
      const newYorkLocaiton: [latitude: number, longitude: number] = [
        40.7128, -74.006,
      ];
      const [lat, long] = faker.location.nearbyGPSCoordinate({
        origin: newYorkLocaiton,
        radius: 100,
      });
      // Adding memories
      await db.insert(memories).values({
        caption: faker.lorem.sentence(),
        date: faker.date.recent(),
        authorId: process.env.SEED_AUTHOR_ID!,
        albumId: album[0].id,
        latitude: lat,
        longitude: long,
        uploadUrl: images[Math.floor(Math.random() * images.length)],
      });
    }
  }
}

main();
