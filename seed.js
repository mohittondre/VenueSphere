const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/VenueSphere";

const sampleListings = [
  {
    title: "Grand Ballroom",
    description: "A luxurious ballroom perfect for weddings and corporate events with crystal chandeliers and panoramic city views.",
    location: "New York City, NY",
    price: 5000,
    category: "Marrige",
    geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
    image: {
      url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
      filename: "ballroom"
    }
  },
  {
    title: "Sunset Beach Resort",
    description: "Beachfront venue with stunning sunset views, perfect for destination weddings and beach parties.",
    location: "Miami Beach, FL",
    price: 3500,
    category: "Destination",
    geometry: { type: "Point", coordinates: [-80.1918, 25.7617] },
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      filename: "beach-resort"
    }
  },
  {
    title: "Downtown Conference Center",
    description: "Modern conference facility with state-of-the-art AV equipment for business meetings and conferences.",
    location: "Chicago, IL",
    price: 2000,
    category: "Meetings",
    geometry: { type: "Point", coordinates: [-87.6298, 41.8781] },
    image: {
      url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800",
      filename: "conference"
    }
  },
  {
    title: "Mountain View Garden",
    description: "Beautiful outdoor garden venue surrounded by mountains, ideal for intimate ceremonies and photo shoots.",
    location: "Denver, CO",
    price: 1500,
    category: "Destination",
    geometry: { type: "Point", coordinates: [-104.9903, 39.7392] },
    image: {
      url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
      filename: "garden"
    }
  },
  {
    title: "Historic Concert Hall",
    description: "Acoustically perfect concert hall with Victorian architecture, hosting performances since 1920.",
    location: "Boston, MA",
    price: 4000,
    category: "Concert",
    geometry: { type: "Point", coordinates: [-71.0589, 42.3601] },
    image: {
      url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
      filename: "concert-hall"
    }
  },
  {
    title: "Rooftop Lounge & Bar",
    description: "Trendy rooftop venue with city skyline views, perfect for cocktail parties and networking events.",
    location: "Los Angeles, CA",
    price: 3000,
    category: "Party",
    geometry: { type: "Point", coordinates: [-118.2437, 34.0522] },
    image: {
      url: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800",
      filename: "rooftop"
    }
  },
  {
    title: "Elegant Birthday Pavilion",
    description: "Beautiful indoor pavilion decorated for birthday celebrations with customizable themes.",
    location: "San Francisco, CA",
    price: 1200,
    category: "Birthday",
    geometry: { type: "Point", coordinates: [-122.4194, 37.7749] },
    image: {
      url: "https://images.unsplash.com/photo-1530103862676-de3c9fa59588?w=800",
      filename: "birthday"
    }
  },
  {
    title: "University Auditorium",
    description: "Spacious auditorium on university campus, suitable for academic conferences and graduation ceremonies.",
    location: "Austin, TX",
    price: 1800,
    category: "Acaademic",
    geometry: { type: "Point", coordinates: [-97.7431, 30.2672] },
    image: {
      url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800",
      filename: "auditorium"
    }
  },
  {
    title: "Festival Ground Arena",
    description: "Large outdoor arena perfect for music festivals, food fairs, and large-scale public events.",
    location: "Seattle, WA",
    price: 6000,
    category: "Festival",
    geometry: { type: "Point", coordinates: [-122.3321, 47.6062] },
    image: {
      url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
      filename: "festival"
    }
  },
  {
    title: "Sports Stadium Center",
    description: "Multi-purpose stadium with retractable roof, hosting sports events and large gatherings.",
    location: "Phoenix, AZ",
    price: 8000,
    category: "Stadium",
    geometry: { type: "Point", coordinates: [-112.074, 33.4484] },
    image: {
      url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      filename: "stadium"
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // Clear existing data
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    // Create a demo user
    const demoUser = new User({
      email: "demo@venuesphere.com",
      username: "demo_user"
    });
    await User.register(demoUser, "demo123");
    console.log("Created demo user: demo@venuesphere.com / demo123");

    // Add listings
    const createdListings = await Listing.insertMany(
      sampleListings.map(listing => ({
        ...listing,
        owner: demoUser._id
      }))
    );
    console.log(`Added ${createdListings.length} demo venues`);

    // Add some reviews
    const reviews = [
      { comment: "Absolutely stunning venue! The staff was incredibly helpful.", rating: 5 },
      { comment: "Great location and beautiful decorations. Would recommend!", rating: 4 },
      { comment: "Perfect for our corporate event. Everything went smoothly.", rating: 5 },
      { comment: "Amazing experience from start to finish.", rating: 5 },
      { comment: "Beautiful place but a bit pricey.", rating: 4 }
    ];

    for (let i = 0; i < Math.min(createdListings.length, reviews.length); i++) {
      const review = new Review({
        comment: reviews[i].comment,
        rating: reviews[i].rating,
        author: demoUser._id
      });
      await review.save();
      createdListings[i].reviews.push(review);
      await createdListings[i].save();
    }
    console.log("Added sample reviews");

    console.log("\n✅ Demo data seeded successfully!");
    console.log("\nLogin credentials:");
    console.log("  Email: demo@venuesphere.com");
    console.log("  Password: demo123");
    console.log("\nVisit http://localhost:8080/listings to see the venues!");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seed();

