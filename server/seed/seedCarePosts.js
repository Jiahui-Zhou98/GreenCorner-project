import { MongoClient } from "mongodb";
import "dotenv/config";

const PLANT_DATA = {
  Tropical: {
    names: ["Monstera Deliciosa", "Fiddle Leaf Fig", "Bird of Paradise", "Peace Lily", "Snake Plant"],
    template: "Provide high humidity and keep the soil moist but not waterlogged. Perfect for indoor corners."
  },
  Succulent: {
    names: ["Jade Plant", "Aloe Vera", "Echeveria", "Zebra Plant", "String of Pearls"],
    template: "Allow soil to dry out completely between waterings. Needs plenty of bright light."
  },
  Cactus: {
    names: ["Prickly Pear", "Golden Barrel Cactus", "Christmas Cactus", "Saguaro", "Old Man Cactus"],
    template: "Minimal watering required. Prefers a very bright, warm location and well-draining soil."
  },
  Fern: {
    names: ["Boston Fern", "Maidenhair Fern", "Staghorn Fern", "Bird's Nest Fern"],
    template: "Keep in a humid environment and never let the soil dry out completely. Mist regularly."
  },
  Herb: {
    names: ["Sweet Basil", "Rosemary", "Peppermint", "Lavender", "Thyme"],
    template: "Ensure at least 6 hours of sunlight. Frequent harvesting encourages bushier growth."
  },
  Flowering: {
    names: ["Orchid", "African Violet", "Anthurium", "Begonia"],
    template: "Needs balanced fertilizer and specific light cycles to encourage blooming."
  }
};

const PLANT_TYPES = Object.keys(PLANT_DATA);

// Matches your DIFFICULTY_STYLE: easy, medium, hard
const DIFFICULTIES = ["easy", "medium", "hard"];

const AUTHORS = [
  "Alice Green",
  "Bob Leaf",
  "Chloe Moss",
  "David Root",
  "Emma Bloom",
];

const LIGHT_REQUIREMENTS = [
  "Bright Indirect",
  "Low Light",
  "Direct Sunlight",
  "Partial Shade",
];
const WATER_REQUIREMENTS = [
  "Every 1-2 weeks",
  "Once a week",
  "Twice a week",
  "Monthly",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCarePosts(count) {
  const posts = [];
  for (let i = 0; i < count; i++) {
    const type = pick(PLANT_TYPES);
    const plantInfo = PLANT_DATA[type];
    const specificName = pick(plantInfo.names);

    posts.push({
      title: specificName,
      plantType: type,
      author: pick(AUTHORS), // Matches post.author
      difficulty: pick(DIFFICULTIES), // Matches easy/medium/hard
      light: pick(LIGHT_REQUIREMENTS), // Matches post.light
      watering: pick(WATER_REQUIREMENTS), // Matches post.watering
      content: `If you are looking for tips on ${specificName}, you've come to the right place. ${plantInfo.template}`,
      imageUrl: null,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
      ),
    });
  }
  return posts;
}

async function seed() {
  // Use 127.0.0.1 to avoid ECONNREFUSED
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/greencorner";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("carePosts");

    await collection.deleteMany({});
    console.log("Connected to MongoDB. Cleared existing carePosts.");

    const posts = generateCarePosts(1000);
    await collection.insertMany(posts);

    console.log(`Seeded ${posts.length} care posts successfully.`);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  } finally {
    await client.close();
  }
}

seed();
