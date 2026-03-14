import { MongoClient } from "mongodb";
import "dotenv/config";

const PLANT_TYPES = [
  "Tropical", "Succulent", "Herb", "Fern", "Flowering", "Cactus",
  "Foliage", "Trailing", "Aquatic", "Carnivorous", "Bulb", "Air Plant", "Bonsai",
];

// Matches your DIFFICULTY_STYLE: easy, medium, hard
const DIFFICULTIES = ["easy", "medium", "hard"];

const AUTHORS = ["Alice Green", "Bob Leaf", "Chloe Moss", "David Root", "Emma Bloom"];

const LIGHT_REQUIREMENTS = ["Bright Indirect", "Low Light", "Direct Sunlight", "Partial Shade"];
const WATER_REQUIREMENTS = ["Every 1-2 weeks", "Once a week", "Twice a week", "Monthly"];

const CARE_TEMPLATES = {
  Tropical: "Provide high humidity and keep the soil moist but not waterlogged.",
  Succulent: "Allow soil to dry out completely between waterings. Needs plenty of sun.",
  Cactus: "Minimal watering required. Prefers a very bright, warm location.",
  Fern: "Keep in a humid environment and never let the soil dry out completely.",
  Herb: "Ensure at least 6 hours of sunlight and harvest leaves to promote growth.",
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCarePosts(count) {
  const posts = [];
  for (let i = 0; i < count; i++) {
    const type = pick(PLANT_TYPES);
    const body = CARE_TEMPLATES[type] || "Standard care includes monitoring soil moisture and providing adequate drainage.";
    
    posts.push({
      title: `Expert Guide: Caring for ${type} Plants`,
      plantType: type,
      author: pick(AUTHORS), // Matches post.author
      difficulty: pick(DIFFICULTIES), // Matches easy/medium/hard
      light: pick(LIGHT_REQUIREMENTS), // Matches post.light
      watering: pick(WATER_REQUIREMENTS), // Matches post.watering
      content: `${body} This species is excellent for indoor collections and responds well to seasonal fertilization during spring and summer.`,
      imageUrl: null,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
    });
  }
  return posts;
}

async function seed() {
  // Use 127.0.0.1 to avoid ECONNREFUSED
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/greencorner";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("carePosts");

    await collection.deleteMany({});
    console.log("Connected to MongoDB. Cleared existing carePosts.");

    const posts = generateCarePosts(1000); 
    await collection.insertMany(posts);

    console.log(`✅ Success! Seeded ${posts.length} English care posts matching your UI.`);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  } finally {
    await client.close();
  }
}

seed();