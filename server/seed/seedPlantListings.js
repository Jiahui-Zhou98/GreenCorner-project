import { MongoClient } from "mongodb";
import "dotenv/config";

const PLANT_TYPES = [
  "Tropical",
  "Succulent",
  "Herb",
  "Fern",
  "Flowering",
  "Cactus",
  "Foliage",
  "Trailing",
  "Aquatic",
  "Carnivorous",
  "Bulb",
  "Air Plant",
  "Bonsai",
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
      "Alocasia",
      "Bird of Paradise",
      "Heliconia",
      "Chinese Evergreen",
      "Philodendron",
      "Dumb Cane",
      "Colocasia",
      "Banana Plant",
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
      "Lithops",
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
      "Echinocactus",
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

  Foliage: {
    names: [
      "Snake Plant",
      "ZZ Plant",
      "Croton",
      "Calathea Orbifolia",
      "Dracaena Marginata",
      "Cast Iron Plant",
      "Caladium",
      "Nerve Plant",
      "Peperomia Caperata",
      "Rubber Tree",
    ],
    descriptions: [
      "A striking foliage plant valued entirely for its bold, patterned leaves rather than its flowers. Has been kept in bright indirect light and watered sparingly — this variety is very drought tolerant and the foliage shows no signs of browning or fading. Repotted into fresh well-draining mix six months ago. A statement plant that works beautifully in modern or minimalist interiors.",
      "A robust, easy-care foliage plant with glossy, architectural leaves that hold their colour and shape year-round. Has been grown in a consistently warm room away from cold drafts and direct afternoon sun. Fertilised monthly throughout the growing season with a balanced liquid feed. Virtually indestructible and highly recommended for beginners who want impressive results with minimal effort.",
      "A visually dramatic foliage plant with vivid, multi-toned leaves that change subtly depending on light levels. Has been kept in a bright spot to maintain the intensity of its colouring — too little light causes the leaf pattern to fade. Watered when the top inch of soil is dry and never allowed to sit in standing water. No pests or disease history. Comes in its current decorative pot.",
      "A rare and sought-after foliage variety with intricately patterned leaves that are genuinely stunning up close. Has been grown with careful attention to humidity and indirect light — both critical for this type. Misted regularly and placed on a pebble tray to maintain the moisture it needs. Healthy new leaves have been emerging consistently over the past three months.",
      "A well-established foliage plant with a strong, upright form and deep, glossy leaves in excellent condition. Has been grown in the same bright corner for over a year with consistent watering and monthly feeding. No yellowing, no pests, and no root issues. Repotted last spring into a slightly larger container with fresh potting mix. An ideal structural plant for living rooms or office spaces.",
    ],
  },

  Trailing: {
    names: [
      "Heartleaf Philodendron",
      "String of Pearls",
      "English Ivy",
      "Hoya Carnosa",
      "Tradescantia",
      "String of Hearts",
      "Devil's Ivy",
      "Inch Plant",
      "Sweet Potato Vine",
      "Chain of Hearts",
    ],
    descriptions: [
      "A vigorous climbing or trailing plant with lush, healthy growth that has been trained along a trellis and is now producing long, full vines. Has been kept in bright indirect light and watered regularly during the growing season. No pests or disease. Currently in a hanging basket that can be included. Perfect for shelves, mantlepieces, or wall-mounted planters.",
      "A beautiful trailing variety with compact, bead-like leaves cascading from a hanging pot. Has been grown in a bright window with excellent air circulation and watered deeply but infrequently to prevent rot at the stem base. Growth has been consistent and healthy with no signs of shrivelling or pest damage. A popular collector's plant that always draws attention.",
      "A vigorous trailing plant that has been thriving in a bright indoor location for several months. Produces long, cascading stems that look stunning in elevated planters or on high shelves. Has been trimmed regularly to encourage bushy, full growth rather than sparse leggy vines. All cuttings have been rooted and can be included as a bonus.",
      "A slow-growing but deeply rewarding trailing plant that has recently produced its first cluster of waxy, star-shaped flowers. Has been grown in well-draining mix and kept in bright but indirect light. Hoyas prefer to be slightly root-bound and this one is perfectly established in its current 4-inch pot. Comes with care notes specific to this variety.",
      "A fast-growing, easy-care trailing plant with vibrant foliage that catches the light beautifully. Has been grown in a hanging planter near a window and has put out several new vines this season. Watered when the top soil feels dry and fertilised monthly. Extremely tolerant of neglect and adapts well to a wide range of indoor conditions.",
    ],
  },

  Aquatic: {
    names: [
      "Lucky Bamboo",
      "Water Hyacinth",
      "Java Moss",
      "Hornwort",
      "Water Lettuce",
      "Anacharis",
      "Arrowhead Plant",
      "Duckweed",
      "Lotus",
      "Tape Grass",
    ],
    descriptions: [
      "A healthy aquatic or water-adapted plant that has been growing in a clean water environment for several months. Water has been changed weekly and supplemented with diluted liquid fertiliser to maintain steady growth. No algae buildup, no yellowing, and roots are bright white and active. A perfect choice for hydroponic setups, decorative vases, or aquarium planting.",
      "This water plant has been thriving in a glass vessel on a bright windowsill with no soil whatsoever. Growth has been consistent and the plant has doubled in size since it was first established. Water quality is maintained with regular changes and a small amount of aquatic plant fertiliser. Comes with its current container and growing medium if desired.",
      "A vibrant aquatic plant in excellent health, currently growing in a shallow tray with just a few centimetres of water. Has been maintained in bright indirect light — direct sun causes algae to form on the container. No signs of rot or disease. Extremely low maintenance and ideal for table centrepieces, zen-style displays, or as a companion in a small fish tank.",
      "A flourishing water plant that has been grown hydroponically from the start and has adapted perfectly to a soil-free environment. Root system is well developed and clearly visible through the glass growing vessel. Has been fed with a diluted aquatic nutrient solution every two weeks. Very easy to divide and propagate — several additional cuttings are available.",
      "A well-established aquatic plant specimen with strong, active growth and healthy root development. Has been kept in clean, filtered water with indirect light and maintained at a consistent room temperature. No chemical treatments have been used at any stage. Ready to be transferred to a new vessel, aquarium, or hydroponic setup immediately upon collection.",
    ],
  },

  Carnivorous: {
    names: [
      "Venus Flytrap",
      "Purple Pitcher Plant",
      "Cape Sundew",
      "Common Butterwort",
      "Tropical Pitcher Plant",
      "Spoonleaf Sundew",
      "Cobra Lily",
      "Fork-leaved Sundew",
      "Rainbow Plant",
      "Bladderwort",
    ],
    descriptions: [
      "A healthy carnivorous plant in active growing condition with fully functional trapping mechanisms. Has been grown in a mixture of pure sphagnum moss and perlite with no added fertiliser — carnivorous plants are adapted to nutrient-poor conditions and fertiliser will damage them. Kept in a tray of distilled or rainwater to maintain constant moisture at the roots. Placed in a bright spot with several hours of direct sun daily.",
      "A well-established carnivorous specimen that is currently producing new traps and showing vigorous growth. Has been maintained strictly on distilled water or collected rainwater — tap water contains minerals that are toxic to these plants. Placed in a south-facing window for maximum light. No signs of blackening traps, fungal issues, or pest damage. Comes with care notes specific to this demanding but rewarding plant.",
      "A fascinating carnivorous plant in excellent condition with active and responsive trapping structures. Has been grown outdoors during summer and moved inside during cold months, following its natural seasonal rhythm. Fed with the occasional small insect or a diluted carnivorous plant fertiliser applied to the leaves. Repotted into fresh sphagnum moss last spring. A genuine conversation piece for any plant collection.",
      "A healthy carnivorous plant that has been carefully maintained in the specific conditions this type demands. Uses only pure water, sits in a bright window, and has never been given tap water or standard potting mix. The trapping structures are vivid, active, and clearly healthy. This is a plant for someone who enjoys the rewarding challenge of growing something truly unusual.",
      "A vigorous carnivorous plant with multiple active traps and strong new growth emerging from the centre of the plant. Has been grown with strict attention to water purity, light levels, and soil composition. Currently in its most active growing phase. Would make an excellent addition to a carnivorous plant collection or as a standalone specimen for someone looking for something genuinely different.",
    ],
  },

  Bulb: {
    names: [
      "Tulip",
      "Amaryllis",
      "Hyacinth",
      "Daffodil",
      "Crocus",
      "Allium",
      "Easter Lily",
      "Muscari",
      "Caladium Bulb",
      "Begonia Tuber",
    ],
    descriptions: [
      "A dormant or actively growing bulb in excellent condition, sourced from a reputable grower and stored correctly in cool, dry conditions until now. The outer scales are intact, the base plate is firm, and there are no signs of rot, mould, or pest damage. Detailed planting instructions included — this bulb should produce vigorous growth and flowers within weeks of planting in the right conditions.",
      "A healthy, firm bulb that was lifted at the correct stage of dormancy and has been stored in optimal conditions since then. Size is above average for this variety, which generally indicates a strong flowering potential. The growing tip is visible and intact. Suitable for container planting, garden borders, or forcing indoors for early blooms. Comes with a care card.",
      "A large, high-quality bulb with no signs of damage, disease, or dehydration. Has been chilled at the correct temperature for the required number of weeks to break dormancy and encourage reliable flowering. Ready to plant immediately. Expected to produce a full, healthy bloom within four to six weeks depending on conditions. Perfect as a gift or for adding seasonal colour to a home.",
      "A well-conditioned bulb in peak planting condition with a firm, intact body and no signs of soft spots or fungal growth. Has been stored at the correct temperature and humidity level to preserve viability. Planting in well-draining compost in a bright location will yield the best results. Comes with specific care and aftercare instructions to help the bulb rebloom in subsequent years.",
      "A premium-grade bulb variety offering exceptional flower size and fragrance when conditions are right. Carefully handled and stored since lifting to maintain maximum viability. The outer skin is dry and papery — exactly as it should be — with a firm, dense body underneath. Instructions for forcing, outdoor planting, and post-bloom care all included. A wonderful addition to any seasonal plant collection.",
    ],
  },

  "Air Plant": {
    names: [
      "Ionantha Tillandsia",
      "Xerographica Tillandsia",
      "Spanish Moss",
      "Caput-Medusae Tillandsia",
      "Bulbosa Tillandsia",
      "Stricta Tillandsia",
      "Brachycaulos Tillandsia",
      "Funckiana Tillandsia",
      "Abdita Tillandsia",
      "Silver Torch Tillandsia",
    ],
    descriptions: [
      "A healthy air plant that requires no soil whatsoever and is one of the most low-maintenance plants you can own. Has been misted two to three times per week and given a full soak in clean water for 20–30 minutes once a week. Kept in bright indirect light with good air circulation — essential for drying off quickly after watering to prevent rot. Leaves are firm, vibrant, and show no signs of browning at the tips.",
      "A striking air plant specimen in excellent health, currently showing the flushed colouring that often precedes blooming. Has been cared for with weekly soaking and bright ambient light. No fertiliser has been used — occasional misting with diluted bromeliad fertiliser is all that is needed for exceptional growth. Completely free of the brown tips or mushy centre that indicate poor care. Comes with a decorative mount or holder.",
      "A mature and well-established air plant that has already produced one offset (pup), which is visible at the base and growing steadily. The mother plant is in excellent health with no browning, no signs of dehydration, and full, spreading leaves. Has been grown mounted on driftwood in a bright room with regular misting. The pup can be separated once it reaches one third the size of the parent.",
      "A wonderfully sculptural air plant with a distinctive form that makes it a natural focal point in any display. Has been maintained with weekly water baths and kept in a spot with bright indirect light and good airflow. All leaves are firm and healthy with no tip browning — a strong indicator of consistent, correct care. Comes with full care instructions and suggestions for creative mounting and display.",
      "A rare and visually striking air plant variety in peak condition. Has been grown by an enthusiast with several years of experience and a deep understanding of what these plants need. Watered by submersion once a week, allowed to dry completely before being returned to its display spot, and given a diluted feed monthly during the growing season. This specimen is genuinely exceptional and ready for an equally attentive new home.",
    ],
  },

  Bonsai: {
    names: [
      "Juniper Bonsai",
      "Chinese Elm Bonsai",
      "Ficus Bonsai",
      "Japanese Maple Bonsai",
      "Jade Bonsai",
      "Fukien Tea Bonsai",
      "Azalea Bonsai",
      "Pine Bonsai",
      "Trident Maple Bonsai",
      "Serissa Bonsai",
    ],
    descriptions: [
      "A beautifully shaped bonsai specimen that has been in training for several years, resulting in a well-developed nebari (surface roots), a tapered trunk, and a balanced canopy structure. Has been maintained with regular pruning, wiring, and repotting on the correct schedule for this species. Currently healthy and actively growing new buds. Comes in its current bonsai pot with care notes specific to this variety.",
      "A mature bonsai with a well-established trunk and elegant branching structure developed through years of patient cultivation. Has been grown outdoors during the warmer months and overwintered correctly to maintain its natural dormancy cycle. Watered daily during the growing season and fed with specialist bonsai fertiliser according to a seasonal schedule. No signs of pest damage, die-back, or root issues.",
      "A refined and aesthetically pleasing bonsai that demonstrates clear evidence of skilled, long-term development. The trunk movement, branch placement, and foliage mass have all been thoughtfully shaped over multiple growing seasons. Currently healthy and vigorous with new growth emerging. Repotted last spring into fresh akadama and pumice mix. Suitable for an intermediate or experienced bonsai enthusiast.",
      "A distinctive bonsai with strong character and a well-defined visual story told through its trunk movement and branching structure. Has been trained using traditional techniques including clip-and-grow and selective wiring. The current styling is clean and balanced. Comes with full documentation of its training history, care schedule, and species-specific requirements. A rewarding plant for someone serious about the art of bonsai.",
      "A healthy, beginner-friendly bonsai variety that has already been through its initial development phase and is now a satisfying and visually complete tree. The hard work of establishing the basic form has already been done — the new owner simply needs to maintain and refine it over time. Has been cared for attentively with correct watering, feeding, and seasonal management. Full care instructions included.",
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
