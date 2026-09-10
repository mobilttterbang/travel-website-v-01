import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const HOSTS = [
  { name: "Ibu Ratna", phone: "+62 812 2412 1555", email: "host1@staycation.id", address: "Jl. Raya Bogor No. 15, Bogor, Indonesia" },
  { name: "Pak Slamet", phone: "+62 812 2400 1444", email: "host2@staycation.id", address: "Jl. Raya Jakarta No. 14, Jakarta, Indonesia" },
  { name: "Dewi & Bagus", phone: "+62 812 2522 1222", email: "host3@staycation.id", address: "Jl. Raya Bandung No. 13, Bandung, Indonesia" },
  { name: "Ibu Nurul", phone: "+62 812 2096 1666", email: "host4@staycation.id", address: "Jl. Raya Malang No. 18, Malang, Indonesia" },
  { name: "Pak Hendra", phone: "+62 812 2274 1444", email: "host5@staycation.id", address: "Jl. Raya Malang No. 14, Malang, Indonesia" },
  { name: "Sinta Maharani", phone: "+62 812 2198 1333", email: "host6@staycation.id", address: "Jl. Raya Medan No. 13, Medan, Indonesia" },
];

const KINDS: Record<string, "Apartment" | "Hotel" | "Villa" | "Home"> = {
  "ps-wood": "Apartment", "one-five": "Apartment", "minimal": "Apartment", "stays-home": "Apartment",
  "green-park": "Hotel", "podo-wae": "Hotel", "silver-rain": "Hotel", "cashville": "Hotel",
  "tabby-town": "Villa", "anggana": "Villa", "seattle-rain": "Villa", "wodden-pit": "Villa", "stark-house": "Villa", "ocean-land": "Villa",
  "village-angga": "Home", "blue-origin": "Home", "vinna-vill": "Home", "bobox": "Home",
};

const POPULAR = new Set(["tabby-town", "cashville", "minimal"]);

const HOUSES = [
  { slug: "village-angga", name: "Village Angga", place: "Bogor, Indonesia", price: 280, rating: 4.9, reviews: 412, visitors: "2,140", bed: 5, bath: 3, live: 1, dine: 1, wifi: 10, tv: 4,
    tags: ["Whole house", "Courtyard", "Mountain air"],
    lead: "a low white house on the ridge, cool all afternoon",
    desc: ["A low white house on the ridge above Bogor, built around a courtyard that stays cool through the afternoon. Five bedrooms, a long kitchen table, and a garden the neighbours' cats consider theirs.",
      "Mornings are quiet enough to hear the kettle two rooms away. The host lives ten minutes down the hill and leaves coffee, fruit and a hand-drawn map of the walking routes on the counter.",
      "Rates cover linen, cleaning at the end of the stay and the whole house — no shared spaces, no minimum booking beyond two nights."] },
  { slug: "blue-origin", name: "Blue Origin Fams", place: "Jakarta, Indonesia", price: 50, rating: 4.8, reviews: 388, visitors: "3,806", bed: 4, bath: 2, live: 1, dine: 1, wifi: 25, tv: 2,
    tags: ["Family sized", "Balcony row", "Sea front"],
    lead: "a painted terrace of rooms facing the water",
    desc: ["A painted terrace on the north shore, four bedrooms deep, with a balcony on every floor and railings close enough to talk between them.",
      "The ground floor opens straight onto the boardwalk, so mornings start with fishing boats and end with the food carts that set up at six."] },
  { slug: "ocean-land", name: "Ocean Land", place: "Bandung, Indonesia", price: 22, rating: 4.7, reviews: 502, visitors: "4,120", bed: 3, bath: 2, live: 1, dine: 1, wifi: 15, tv: 1,
    tags: ["Best value", "Loungers", "Timber deck"],
    lead: "a timber deck of loungers under a thatched roof",
    desc: ["A long timber deck under thatch, with loungers that stay warm past sunset and a pool the length of the building.",
      "The cheapest bed on our list that still comes with a real kitchen — bring groceries from the market two streets up."] },
  { slug: "stark-house", name: "Stark House", place: "Malang, Indonesia", price: 856, rating: 5.0, reviews: 96, visitors: "740", bed: 6, bath: 5, live: 2, dine: 2, wifi: 100, tv: 5,
    tags: ["Architect built", "Infinity pool", "Staffed"],
    lead: "concrete, glass and an infinity pool over the valley",
    desc: ["Three storeys of concrete and glass cantilevered over the valley, with an infinity pool that reads as the horizon from inside.",
      "Comes staffed: a cook for two meals a day, daily housekeeping, and a driver on call. The largest booking we handle, and the one people plan a year out."] },
  { slug: "vinna-vill", name: "Vinna Vill", place: "Malang, Indonesia", price: 62, rating: 4.8, reviews: 274, visitors: "1,980", bed: 4, bath: 3, live: 1, dine: 1, wifi: 20, tv: 2,
    tags: ["Whitewashed", "Garden", "Quiet street"],
    lead: "whitewashed arches and a bougainvillea garden",
    desc: ["Whitewashed arches, tiled floors and a garden that has been left slightly wild on purpose — bougainvillea over most of the front wall.",
      "Four bedrooms across two wings, which makes it work for two families who want to hear less of each other."] },
  { slug: "bobox", name: "Bobox", place: "Medan, Indonesia", price: 72, rating: 4.7, reviews: 198, visitors: "1,410", bed: 3, bath: 2, live: 1, dine: 1, wifi: 30, tv: 2,
    tags: ["Gabled", "Log fire", "Hill road"],
    lead: "a steep-gabled house with a log fire",
    desc: ["A steep-gabled house at the end of a hill road, with a log fire that the host lights before you arrive if the forecast asks for it.",
      "Small enough to heat quickly, big enough for three couples. Cell signal is patchy by the door and fine on the deck."] },
  { slug: "tabby-town", name: "Tabby Town", place: "Gunung Batu, Indonesia", price: 96, rating: 4.9, reviews: 331, visitors: "2,530", bed: 4, bath: 3, live: 1, dine: 1, wifi: 20, tv: 2,
    tags: ["Popular choice", "Glasshouse", "Beauty backyard"],
    lead: "a glasshouse wall onto a planted backyard",
    desc: ["A glasshouse wall runs the length of the living room and opens onto the most planted backyard on our list — ferns, citrus, and a bench that gets the last of the sun.",
      "The most-favourited house in the region three seasons running, so dates go early."] },
  { slug: "anggana", name: "Anggana", place: "Bogor, Indonesia", price: 88, rating: 4.6, reviews: 145, visitors: "1,120", bed: 3, bath: 2, live: 1, dine: 1, wifi: 15, tv: 1,
    tags: ["Pool", "Lawn", "Family friendly"],
    lead: "a kidney pool and a lawn wide enough for football",
    desc: ["A kidney-shaped pool, a lawn wide enough for a game of football, and a covered veranda for when the afternoon rain arrives.",
      "Fenced on all sides, which is why families with small children keep coming back to it."] },
  { slug: "seattle-rain", name: "Seattle Rain", place: "Jakarta, Indonesia", price: 180, rating: 4.8, reviews: 226, visitors: "1,760", bed: 4, bath: 3, live: 2, dine: 1, wifi: 50, tv: 3,
    tags: ["Palms", "Long veranda", "Work friendly"],
    lead: "a single-storey house under palms with a long veranda",
    desc: ["A single-storey house under palms, all rooms opening onto one long veranda so nobody has to walk through anybody else's space.",
      "The fastest connection we have outside Malang, and a desk in each of the two living rooms."] },
  { slug: "wodden-pit", name: "Wodden Pit", place: "Wonosobo, Indonesia", price: 74, rating: 4.7, reviews: 167, visitors: "1,290", bed: 3, bath: 2, live: 1, dine: 1, wifi: 10, tv: 1,
    tags: ["Timber", "Wood stove", "Forest"],
    lead: "a timber cabin on stilts in the forest",
    desc: ["A timber cabin on stilts at the forest edge, with a chimney that draws well and a wraparound deck for drying boots.",
      "Cold at night by Indonesian standards — the wood is stacked under the stairs and included."] },
  { slug: "green-park", name: "Green Park", place: "Tangerang, Indonesia", price: 120, rating: 4.7, reviews: 210, visitors: "1,640", bed: 3, bath: 2, live: 2, dine: 1, wifi: 40, tv: 2,
    tags: ["Large living room", "Plant filled", "Bright"],
    lead: "two living rooms, both full of plants and daylight",
    desc: ["Two living rooms, both glazed on the long side and full of plants that the housekeeper waters twice a week.",
      "The larger room seats nine, which is why it gets booked for family reunions more than holidays."] },
  { slug: "podo-wae", name: "Podo Wae", place: "Madiun, Indonesia", price: 240, rating: 4.9, reviews: 288, visitors: "2,010", bed: 4, bath: 3, live: 1, dine: 1, wifi: 25, tv: 2,
    tags: ["Open plan", "Island kitchen", "Stairs to loft"],
    lead: "an open-plan floor around an island kitchen",
    desc: ["One open floor built around an island kitchen, with a staircase to a loft that most guests end up sleeping in.",
      "Teal and timber throughout — the house our photographers keep using for their own portfolios."] },
  { slug: "silver-rain", name: "Silver Rain", place: "Bandung, Indonesia", price: 150, rating: 4.6, reviews: 132, visitors: "980", bed: 3, bath: 2, live: 1, dine: 1, wifi: 30, tv: 2,
    tags: ["Art on walls", "Grey palette", "City edge"],
    lead: "a grey-palette house hung with the owner's prints",
    desc: ["A grey-palette house on the city edge, hung with the owner's own prints and lit properly for once.",
      "Ten minutes from the coffee streets and far enough out that the traffic stops at nine."] },
  { slug: "cashville", name: "Cashville", place: "Kemang, Indonesia", price: 196, rating: 4.9, reviews: 356, visitors: "2,720", bed: 4, bath: 3, live: 2, dine: 1, wifi: 60, tv: 3,
    tags: ["Popular choice", "Corner sofa", "Walkable"],
    lead: "a corner sofa, a long table and Kemang outside",
    desc: ["A wide corner sofa, a table long enough for ten, and the whole of Kemang within a fifteen-minute walk.",
      "The most-booked house in Jakarta this year, mostly by people who came once for work and returned with family."] },
  { slug: "ps-wood", name: "PS Wood", place: "Depok, Indonesia", price: 110, rating: 4.6, reviews: 118, visitors: "870", bed: 2, bath: 1, live: 1, dine: 1, wifi: 20, tv: 1,
    tags: ["Kitchen set", "Marble tops", "Compact"],
    lead: "a white marble kitchen in a compact apartment",
    desc: ["A compact apartment whose whole point is the kitchen: white marble tops, a six-burner range and a rail of good pans.",
      "Two bedrooms, both quiet, and a market on the ground floor of the building next door."] },
  { slug: "one-five", name: "One Five", place: "Jakarta, Indonesia", price: 132, rating: 4.7, reviews: 156, visitors: "1,180", bed: 2, bath: 2, live: 1, dine: 1, wifi: 50, tv: 2,
    tags: ["Kitchen island", "Bar stools", "High floor"],
    lead: "a dark-timber island with four bar stools",
    desc: ["Dark timber cabinetry, an island with four stools, and windows on the fifteenth floor that make the traffic look ornamental.",
      "Set up for people who cook and work in the same room without minding it."] },
  { slug: "minimal", name: "Minimal", place: "Bogor, Indonesia", price: 104, rating: 4.8, reviews: 204, visitors: "1,520", bed: 2, bath: 1, live: 1, dine: 1, wifi: 25, tv: 1,
    tags: ["Popular choice", "Matte black", "Two guests"],
    lead: "matte black fittings and nothing on the counters",
    desc: ["Matte black fittings, nothing on the counters, and a fridge that was stocked the morning of your arrival.",
      "Built for two. Booking it for four works on paper and not in practice."] },
  { slug: "stays-home", name: "Stays Home", place: "Wonosobo, Indonesia", price: 118, rating: 4.7, reviews: 141, visitors: "1,030", bed: 3, bath: 2, live: 1, dine: 1, wifi: 15, tv: 1,
    tags: ["Farmhouse kitchen", "Copper pans", "Village"],
    lead: "a farmhouse kitchen hung with copper pans",
    desc: ["A farmhouse kitchen hung with copper pans, a scrubbed table and a stove that takes a while to come up to heat and then holds it all evening.",
      "In the village proper, so bread and eggs are a two-minute walk and the church bell is a fact of life."] },
];

const STORIES = [
  { id: "st1", name: "Angga Risky", role: "Product designer", stay: "Village Angga", slug: "village-angga", when: "Jan 2027", rating: 5.0,
    quote: "What a great trip with my family, I should try again next time soon.",
    detail: "Booked on a Thursday, unpacked by Friday, forgot my laptop existed by Saturday. The host left a map of the walking routes that we actually used." },
  { id: "st2", name: "Anggi Pratiwi", role: "Teacher", stay: "Cashville", slug: "cashville", when: "Dec 2026", rating: 4.8,
    quote: "As a wife I can pick a great trip with my own lovely family … thank you!",
    detail: "The corner sofa held all six of us for a film on the first night. Kemang outside meant nobody had to drive anywhere for four days." },
  { id: "st3", name: "Bayu Setiawan", role: "Cyclist", stay: "Bobox", slug: "bobox", when: "Nov 2026", rating: 4.6,
    quote: "Fire was lit when we arrived cold and soaked. That is the whole review.",
    detail: "Signal is genuinely poor by the door, which the listing says and I ignored. Fine on the deck, and honestly better that way." },
  { id: "st4", name: "Sari Wijaya", role: "Pastry chef", stay: "PS Wood", slug: "ps-wood", when: "Oct 2026", rating: 4.9,
    quote: "First rental kitchen where I did not have to buy a sharp knife on day one.",
    detail: "Six burners, a marble top cold enough for pastry, and a market downstairs. I cooked every night and never left the building before noon." },
  { id: "st5", name: "Dimas Haryo", role: "Engineer", stay: "Seattle Rain", slug: "seattle-rain", when: "Aug 2026", rating: 4.7,
    quote: "Took two calls from the veranda with nobody at home hearing the kids.",
    detail: "Worked three of the five days and did not resent it. The long veranda means every room has its own way out." },
  { id: "st6", name: "Mira Lestari", role: "Photographer", stay: "Podo Wae", slug: "podo-wae", when: "Jun 2026", rating: 5.0,
    quote: "Shot a whole lookbook in the loft and paid a holiday rate for the studio.",
    detail: "Light comes across the island kitchen until about four. Host was relaxed about the extra hour on checkout." },
];

async function main() {
  console.log("Seeding hosts…");
  const hostRecords = await Promise.all(
    HOSTS.map((h) => prisma.host.create({ data: h }))
  );

  console.log("Seeding houses…");
  for (let i = 0; i < HOUSES.length; i++) {
    const h = HOUSES[i];
    const [city, country] = h.place.split(",").map((s) => s.trim());
    await prisma.house.create({
      data: {
        slug: h.slug,
        name: h.name,
        city,
        country: country ?? "Indonesia",
        kind: KINDS[h.slug],
        price: h.price,
        rating: h.rating,
        reviews: h.reviews,
        visitors: h.visitors,
        bed: h.bed,
        bath: h.bath,
        living: h.live,
        dining: h.dine,
        wifi: h.wifi,
        tv: h.tv,
        tags: h.tags,
        lead: h.lead,
        description: h.desc,
        popular: POPULAR.has(h.slug),
        hostId: hostRecords[i % hostRecords.length].id,
      },
    });
  }

  console.log("Seeding stories…");
  for (const s of STORIES) {
    const house = await prisma.house.findUniqueOrThrow({ where: { slug: s.slug } });
    await prisma.story.create({
      data: {
        authorName: s.name,
        role: s.role,
        rating: s.rating,
        quote: s.quote,
        detail: s.detail,
        stayedAt: s.when,
        houseId: house.id,
      },
    });
  }

  console.log("Seeding a demo user…");
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "angga@staycation.id",
      passwordHash,
      firstName: "Angga",
      lastName: "Risky",
      phone: "0821 2020 2020",
      city: "Kemang, Jakarta",
      memberSince: "2019",
      bio: "Designs for a living, books two-night houses within four hours' drive, travels with three others and a camera.",
      preferredStyles: ["Homie", "Nature-villa"],
      preferredCities: ["Bogor", "Bandung"],
      budgetBand: "$50 – $200",
    },
  });

  console.log("Seeding demo bookings…");
  const villageAngga = await prisma.house.findUniqueOrThrow({ where: { slug: "village-angga" } });
  const blueOrigin = await prisma.house.findUniqueOrThrow({ where: { slug: "blue-origin" } });
  const podoWae = await prisma.house.findUniqueOrThrow({ where: { slug: "podo-wae" } });
  const seattleRain = await prisma.house.findUniqueOrThrow({ where: { slug: "seattle-rain" } });
  const bobox = await prisma.house.findUniqueOrThrow({ where: { slug: "bobox" } });

  const demoBookings: Array<{
    house: typeof villageAngga;
    ref: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    status: "Upcoming" | "AwaitingPayment" | "Completed" | "Cancelled";
    cancelReason?: string;
    paid: boolean;
  }> = [
    { house: villageAngga, ref: "STC-4192", checkIn: "2027-01-20", checkOut: "2027-01-22", guests: "2 guests", status: "Upcoming", paid: true },
    { house: blueOrigin, ref: "STC-4021", checkIn: "2027-02-14", checkOut: "2027-02-17", guests: "4 guests", status: "AwaitingPayment", paid: false },
    { house: podoWae, ref: "STC-3877", checkIn: "2026-11-03", checkOut: "2026-11-05", guests: "2 guests", status: "Completed", paid: true },
    { house: seattleRain, ref: "STC-3610", checkIn: "2026-08-08", checkOut: "2026-08-12", guests: "3 guests", status: "Completed", paid: true },
    { house: bobox, ref: "STC-3402", checkIn: "2026-04-19", checkOut: "2026-04-21", guests: "2 guests", status: "Cancelled", cancelReason: "Dates no longer work", paid: false },
  ];

  for (const b of demoBookings) {
    const nights = Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000);
    const sub = b.house.price * nights;
    const tax = Math.round(sub * 0.1);
    await prisma.booking.create({
      data: {
        ref: b.ref,
        checkIn: new Date(b.checkIn),
        checkOut: new Date(b.checkOut),
        guests: b.guests,
        status: b.status,
        cancelReason: b.cancelReason ?? "",
        guestFirstName: demoUser.firstName,
        guestLastName: demoUser.lastName,
        guestEmail: demoUser.email,
        guestPhone: demoUser.phone,
        userId: demoUser.id,
        houseId: b.house.id,
        payment: {
          create: {
            method: "Card",
            status: b.paid ? "Paid" : "Pending",
            amountSub: sub,
            amountTax: tax,
            amountTotal: sub + tax,
            cardBrand: "Visa",
            cardLast4: "4242",
          },
        },
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
