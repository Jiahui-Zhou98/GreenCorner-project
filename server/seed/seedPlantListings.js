import { MongoClient } from "mongodb";
import "dotenv/config";

const PLANT_TYPES = [
  "Tropical",
  "Succulent",
  "Herb",
  "Fern",
  "Flowering",
  "Cactus",
];

const LISTING_TYPES = ["free", "for sale", "rehoming"];

const CONDITIONS = ["excellent", "good", "fair"];

const STATUSES = ["available", "available", "available", "pending", "sold"];

const LOCATIONS = [
  "Boston, MA",
  "Cambridge, MA",
  "Somerville, MA",
  "Brookline, MA",
  "Quincy, MA",
  "Newton, MA",
  "Medford, MA",
  "Malden, MA",
  "Lynn, MA",
  "Waltham, MA",
];

const SELLERS = [
  { name: "Alice Green", email: "alice.green@gmail.com" },
  { name: "Bob Leaf", email: "bob.leaf@gmail.com" },
  { name: "Chloe Moss", email: "chloe.moss@gmail.com" },
  { name: "David Root", email: "david.root@gmail.com" },
  { name: "Emma Bloom", email: "emma.bloom@gmail.com" },
  { name: "Frank Sprout", email: "frank.sprout@gmail.com" },
  { name: "Grace Fern", email: "grace.fern@gmail.com" },
  { name: "Henry Vine", email: "henry.vine@gmail.com" },
  { name: "Isabella Rose", email: "isabella.rose@gmail.com" },
  { name: "James Thorn", email: "james.thorn@gmail.com" },
  { name: "Karen Petal", email: "karen.petal@gmail.com" },
  { name: "Leo Bark", email: "leo.bark@gmail.com" },
  { name: "Mia Dew", email: "mia.dew@gmail.com" },
  { name: "Noah Seed", email: "noah.seed@gmail.com" },
  { name: "Olivia Branch", email: "olivia.branch@gmail.com" },
  { name: "Priya Sharma", email: "priya.sharma@gmail.com" },
  { name: "Quinn Walker", email: "quinn.walker@gmail.com" },
  { name: "Rachel Stone", email: "rachel.stone@gmail.com" },
  { name: "Sam Rivers", email: "sam.rivers@gmail.com" },
  { name: "Tina Woods", email: "tina.woods@gmail.com" },
  { name: "Uma Patel", email: "uma.patel@gmail.com" },
  { name: "Victor Lane", email: "victor.lane@gmail.com" },
  { name: "Wendy Flora", email: "wendy.flora@gmail.com" },
  { name: "Xander Cole", email: "xander.cole@gmail.com" },
  { name: "Yuki Tanaka", email: "yuki.tanaka@gmail.com" },
  { name: "Zoe Harper", email: "zoe.harper@gmail.com" },
  { name: "Aaron Fields", email: "aaron.fields@gmail.com" },
  { name: "Bella Cruz", email: "bella.cruz@gmail.com" },
  { name: "Carlos Mena", email: "carlos.mena@gmail.com" },
  { name: "Diana Park", email: "diana.park@gmail.com" },
  { name: "Ethan Brooks", email: "ethan.brooks@gmail.com" },
  { name: "Fiona Marsh", email: "fiona.marsh@gmail.com" },
  { name: "George Kim", email: "george.kim@gmail.com" },
  { name: "Hannah Plum", email: "hannah.plum@gmail.com" },
  { name: "Ian Foster", email: "ian.foster@gmail.com" },
  { name: "Julia Stern", email: "julia.stern@gmail.com" },
];

const TAGS_POOL = [
  "low-maintenance",
  "beginner-friendly",
  "pet-safe",
  "air-purifying",
  "fast-growing",
  "rare",
  "drought-tolerant",
  "shade-loving",
  "sun-loving",
  "edible",
  "fragrant",
  "trailing",
];

const PLANT_DATA = {
  Tropical: {
    names: [
      "Monstera Deliciosa",
      "Pothos",
      "Bird of Paradise",
      "Peace Lily",
      "Chinese Evergreen",
      "Philodendron",
      "Dumb Cane",
      "Anthurium",
      "Rubber Plant",
      "Areca Palm",
    ],
    descriptions: [
      "A healthy and vibrant tropical plant with lush, fenestrated green leaves that have been growing steadily for over a year. It has been kept in bright indirect light and watered consistently every 7–10 days. The root system is well established and the plant was repotted into fresh aroid mix three months ago. No signs of pests or disease. Comes with a care card and is ready for its new home.",
      "This tropical plant has been thriving on a north-facing windowsill with filtered light for over 14 months. Leaves are large, deep green, and show no yellowing or browning. It has been fertilised monthly during the growing season and is currently producing a new leaf. Ideal for anyone looking for a low-maintenance statement plant.",
      "Well-established with multiple new growth points emerging and a strong, healthy root system visible at the drainage holes. This plant has been grown in a well-draining potting mix with perlite and has never been overwatered. Perfect for a bright living room or office space. Will be wrapped carefully for transport.",
      "A lush, full tropical specimen that was recently repotted into a slightly larger pot with fresh soil. It has two new leaves unfurling and shows excellent overall vigour. Has been kept away from cold drafts and direct afternoon sun. The perfect plant to create a jungle corner in your home.",
      "A stunning tropical plant with no history of pests or disease. Has been grown indoors under consistent humidity and indirect light. Leaves are glossy and firm with vibrant colouring. Comes with full care instructions including watering schedule, light requirements, and fertilisation tips.",
    ],
  },
  Succulent: {
    names: [
      "Echeveria",
      "Jade Plant",
      "Aloe Vera",
      "Haworthia",
      "Sedum",
      "Aeonium",
      "Crassula",
      "Gasteria",
      "Sempervivum",
      "Kalanchoe",
    ],
    descriptions: [
      "A compact and perfectly shaped succulent with plump, well-hydrated leaves arranged in a tight rosette. Has been grown in a gritty, well-draining cactus mix and placed on a south-facing windowsill for at least 6 hours of light daily. Has never been overwatered — leaves are firm and vibrant. Perfect for a desk, windowsill, or terrarium arrangement.",
      "This succulent has been growing steadily for over eight months with minimal intervention. The leaves are full of moisture and show rich, healthy colouring with no mushy or shrivelled sections. It has been watered deeply once every two weeks and left to dry completely between waterings. A great starter plant for anyone new to succulents.",
      "A beautiful rosette-shaped succulent freshly propagated from a healthy mother plant. The new offsets are well rooted and showing vigorous growth. Grown in bright indirect light with occasional direct morning sun. Has been fertilised once with diluted succulent fertiliser during the growing season. Low maintenance and very forgiving.",
      "Drought-tolerant and resilient — this succulent is ideal for anyone who travels frequently or tends to forget watering schedules. It has been grown in a terracotta pot for excellent drainage and kept in a bright spot year-round. The leaves are plump and the plant is currently producing a small side offset that will eventually be separable.",
      "A thriving succulent with excellent structural form and vibrant leaf colouring. Has been grown organically without chemical fertilisers. The root system is healthy and compact. Currently in a 3-inch nursery pot but would do well in a decorative container. Suitable for beginners and experienced plant owners alike.",
    ],
  },
  Herb: {
    names: [
      "Basil",
      "Mint",
      "Rosemary",
      "Thyme",
      "Lavender",
      "Oregano",
      "Cilantro",
      "Parsley",
      "Chives",
      "Lemon Balm",
    ],
    descriptions: [
      "Freshly potted in organic compost and ready to harvest from day one. Grown entirely without pesticides or synthetic fertilisers — completely safe for cooking and handling. Placed on a sunny south-facing sill for at least 5 hours of direct light daily. The stems are bushy and full with plenty of harvestable leaves. Instructions for pinching and pruning included.",
      "A bushy, fragrant herb plant producing abundant foliage ready for harvest. Has been growing on a bright windowsill for two months and responding well to regular trimming. The more you harvest, the bushier it grows. Comes in a biodegradable pot that can be planted directly into a larger container or garden bed.",
      "A healthy, established herb plant that has been growing on a sunny kitchen windowsill for several months. Aromas are strong and the foliage is dense and green. Has been watered consistently at the base to avoid leaf disease and fed with a diluted liquid fertiliser once a month. Great for culinary use in teas, cooking, and garnishes.",
      "Compact and productive — this herb is already putting out plenty of leaves for regular harvest. Grown in a well-draining potting mix amended with compost. No chemical treatments have been used at any stage of growth. Perfect for a kitchen herb garden or a sunny balcony. Comes with basic care and harvesting tips.",
      "An organically grown herb plant raised from seed with no chemicals used at any stage. The plant is full and healthy with a strong, pleasant fragrance. Has been hardened off for outdoor conditions but also does well indoors with sufficient light. A great addition to any kitchen garden, window box, or container planting.",
    ],
  },
  Fern: {
    names: [
      "Boston Fern",
      "Maidenhair Fern",
      "Bird's Nest Fern",
      "Staghorn Fern",
      "Sword Fern",
      "Rabbit's Foot Fern",
      "Holly Fern",
      "Kimberly Queen Fern",
      "Asparagus Fern",
      "Autumn Fern",
    ],
    descriptions: [
      "A lush and full fern with cascading fronds in excellent condition. Has been grown in a humid environment and misted daily to maintain the moisture levels it thrives on. Placed in a bright spot away from direct sun, away from heating vents and cold drafts. No browning or crisping on the frond tips. Ideal for a bathroom, kitchen, or shaded corner of a living room.",
      "Delicate, arching fronds in excellent condition — no yellowing, browning, or pest damage of any kind. Has been misted regularly and kept away from direct sunlight for its entire life. Repotted into fresh peat-free potting mix two months ago. Ferns like this one can be temperamental, but this specimen is thriving and clearly established in its current care routine.",
      "A beautiful fern with fresh, upright fronds that add texture and softness to any indoor space. Repotted last month into a slightly larger container with moisture-retaining potting mix. Has been kept in a consistently cool and humid location. No pest history and no signs of root rot. Will be packed with its soil to minimise transplant stress.",
      "Full, healthy, and vigorous — this fern has been kept in consistently moist (but not waterlogged) soil with regular misting. No tip browning, which can be a common sign of dry air or inconsistent watering. Has been fed with a diluted liquid fertiliser once every six weeks during spring and summer. Comes with detailed care notes.",
      "A classic fern variety with dense, arching fronds in deep green. Has been kept in filtered indoor light and watered from the bottom to encourage deep root growth. No pests or diseases observed. This is a mature, well-established plant that will adapt well to most indoor environments as long as humidity is maintained.",
    ],
  },
  Flowering: {
    names: [
      "African Violet",
      "Peace Lily",
      "Orchid",
      "Begonia",
      "Impatiens",
      "Bromeliad",
      "Anthurium",
      "Cyclamen",
      "Kalanchoe",
      "Christmas Cactus",
    ],
    descriptions: [
      "Currently in full bloom with clusters of vibrant flowers in excellent condition. Has been fertilised regularly with a bloom-specific fertiliser and kept in bright indirect light to encourage continuous flowering. The root system is healthy and the foliage is lush and green beneath the flowers. A wonderful gift plant or statement piece for a bright room.",
      "Multiple new buds are forming and about to open — this plant will be in full bloom within days of arriving in its new home. Has been cared for attentively with consistent watering and feeding throughout the growing season. Placed in a spot with bright, indirect light and good air circulation. Rewarding to watch and very easy to keep going.",
      "A healthy flowering plant with a strong root system and new flower stalks currently emerging. Has been grown in well-draining potting mix and placed in an east-facing window for gentle morning light. Has been fed with a balanced liquid fertiliser monthly. Comes in its current pot and can be repotted once blooming has finished.",
      "Producing beautiful, long-lasting blooms that have held for over three weeks so far. Has been fertilised regularly with a high-potassium feed to support flower production. Foliage is lush and healthy with no signs of leaf drop or yellowing. Easy to rebloom by adjusting light and feeding cycles — full instructions included.",
      "A cheerful and resilient flowering plant that brightens any room it is placed in. Has been rebloomed successfully twice already following basic light and watering adjustments. Currently producing new flower buds alongside healthy green foliage. Comes with a full reblooming guide so you can enjoy flowers again and again.",
    ],
  },
  Cactus: {
    names: [
      "Golden Barrel Cactus",
      "Prickly Pear",
      "Saguaro",
      "Moon Cactus",
      "Bunny Ears Cactus",
      "Christmas Cactus",
      "Mammillaria",
      "Cereus",
      "Ferocactus",
      "Opuntia",
    ],
    descriptions: [
      "A sturdy and characterful cactus that has been growing steadily for over 18 months in a south-facing window. Watered deeply once every two to three weeks in summer and barely at all in winter — exactly as it prefers. Spine structure is fully intact and the body shows no soft spots or discolouration. A virtually indestructible plant for sunny spaces.",
      "Compact and full of character — this cactus has been thriving in a bright, sunny spot with minimal intervention. Has been grown in a specialist cactus compost with added grit for excellent drainage. The pot has a drainage hole and has never sat in standing water. Perfect for a sunny windowsill, desk, or shelf.",
      "A well-established cactus that has been growing steadily in the same terracotta pot for over a year. The body is firm and healthy with no signs of rot, etiolation, or pest damage. Spines are well-developed and evenly distributed. Has been repotted once during this time into fresh cactus mix. Ready to continue growing in a new home.",
      "Virtually indestructible with the right amount of direct sun — this cactus has proven itself over multiple seasons of minimal care. It has survived drought conditions and comes back stronger each growing season. A great choice for beginners, frequent travellers, or anyone who wants a thriving plant with minimal effort. No pests, no diseases.",
      "A unique and eye-catching cactus variety in excellent condition with no pest or disease history. Has been grown entirely in a gritty, mineral-rich cactus mix and placed in full sun throughout the growing season. The form and spine pattern are clearly defined and visually striking. Comes with basic care guidance for continued healthy growth.",
    ],
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickTags() {
  const shuffled = [...TAGS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
}

function generatePrice(listingType) {
  if (listingType === "free") return 0;
  if (listingType === "rehoming") return Math.floor(Math.random() * 5) + 1;
  const tiers = [5, 8, 10, 12, 15, 18, 20, 25, 30];
  return pick(tiers);
}

function generateListings(count) {
  const listings = [];
  for (let i = 0; i < count; i++) {
    const plantType = pick(PLANT_TYPES);
    const data = PLANT_DATA[plantType];
    const listingType = pick(LISTING_TYPES);
    const seller = pick(SELLERS);

    listings.push({
      plantName: pick(data.names),
      plantType,
      description: pick(data.descriptions),
      condition: pick(CONDITIONS),
      listingType,
      price: generatePrice(listingType),
      location: pick(LOCATIONS),
      status: pick(STATUSES),
      sellerName: seller.name,
      sellerEmail: seller.email,
      tags: pickTags(),
      imageUrl: null,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
      ),
    });
  }
  return listings;
}

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("plantListings");

    await collection.deleteMany({});
    console.log("Cleared existing plantListings.");

    const listings = generateListings(1000);
    await collection.insertMany(listings);
    console.log(`Inserted ${listings.length} plant listings.`);
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
