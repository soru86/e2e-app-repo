import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set default DATABASE_URL if not provided
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://super_shop:super_shop_pw@localhost:5432/super_shop";
  console.log("⚠️  DATABASE_URL not set, using default: postgresql://super_shop:super_shop_pw@localhost:5432/super_shop");
}

const prisma = new PrismaClient();

// Product categories and names for inventory
const productCategories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Automotive",
  "Health & Beauty",
  "Food & Beverages",
  "Office Supplies",
];

const productNames = {
  Electronics: [
    "Smartphone",
    "Laptop",
    "Tablet",
    "Smart Watch",
    "Headphones",
    "Bluetooth Speaker",
    "Camera",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Router",
    "Smart TV",
    "Gaming Console",
    "Drone",
    "Earbuds",
  ],
  Clothing: [
    "T-Shirt",
    "Jeans",
    "Jacket",
    "Sneakers",
    "Dress",
    "Hoodie",
    "Shorts",
    "Pants",
    "Sweater",
    "Hat",
    "Socks",
    "Underwear",
    "Gloves",
    "Scarf",
    "Belt",
  ],
  "Home & Garden": [
    "Coffee Maker",
    "Vacuum Cleaner",
    "Lamp",
    "Plant Pot",
    "Garden Tool",
    "Furniture",
    "Curtains",
    "Rug",
    "Pillow",
    "Blanket",
    "Cookware Set",
    "Dinnerware",
    "Storage Box",
    "Wall Art",
    "Mirror",
  ],
  "Sports & Outdoors": [
    "Bicycle",
    "Tennis Racket",
    "Basketball",
    "Yoga Mat",
    "Dumbbells",
    "Running Shoes",
    "Camping Tent",
    "Backpack",
    "Water Bottle",
    "Fitness Tracker",
    "Golf Clubs",
    "Skateboard",
    "Surfboard",
    "Hiking Boots",
    "Swimming Goggles",
  ],
  Books: [
    "Fiction Novel",
    "Non-Fiction Book",
    "Cookbook",
    "Children's Book",
    "Textbook",
    "Comic Book",
    "Biography",
    "Self-Help Book",
    "Mystery Novel",
    "Science Fiction",
    "Fantasy Book",
    "History Book",
    "Poetry Collection",
    "Art Book",
    "Reference Guide",
  ],
  "Toys & Games": [
    "Board Game",
    "Puzzle",
    "Action Figure",
    "Doll",
    "Building Blocks",
    "Remote Control Car",
    "Card Game",
    "Video Game",
    "Stuffed Animal",
    "Musical Toy",
    "Educational Toy",
    "Outdoor Toy",
    "Art Supplies",
    "Science Kit",
    "LEGO Set",
  ],
  Automotive: [
    "Car Battery",
    "Tire",
    "Oil Filter",
    "Brake Pad",
    "Headlight",
    "Car Mat",
    "Phone Mount",
    "Dash Cam",
    "Car Charger",
    "Air Freshener",
    "Tool Kit",
    "Jump Starter",
    "Tire Pressure Gauge",
    "Car Cover",
    "Windshield Wiper",
  ],
  "Health & Beauty": [
    "Shampoo",
    "Conditioner",
    "Face Cream",
    "Toothbrush",
    "Toothpaste",
    "Deodorant",
    "Perfume",
    "Makeup Kit",
    "Hair Dryer",
    "Electric Razor",
    "Vitamins",
    "Protein Powder",
    "Yoga Mat",
    "Massage Oil",
    "Skincare Set",
  ],
  "Food & Beverages": [
    "Coffee Beans",
    "Tea Collection",
    "Chocolate Box",
    "Snack Pack",
    "Energy Drink",
    "Protein Bar",
    "Cereal",
    "Pasta",
    "Sauce",
    "Spice Set",
    "Olive Oil",
    "Honey",
    "Nuts",
    "Dried Fruits",
    "Gift Basket",
  ],
  "Office Supplies": [
    "Notebook",
    "Pen Set",
    "Stapler",
    "Paper Clips",
    "Folder",
    "Binder",
    "Desk Organizer",
    "Calculator",
    "Printer Paper",
    "Envelopes",
    "Label Maker",
    "Whiteboard",
    "Markers",
    "Tape",
    "Scissors",
  ],
};

const issueCategories = ["PAYMENT", "DELIVERY", "PRODUCT", "ACCOUNT", "REFUND", "ORDER", "TECHNICAL"];
const issueStatuses = ["OPEN", "ACKNOWLEDGED", "RESOLVED"];
const orderStatuses = ["PENDING", "PAID", "FULFILLED"];
const discountTypes = ["PERCENTAGE", "FLAT"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSKU(category: string, index: number): string {
  const prefix = category
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .substring(0, 3);
  return `SKU-${prefix}-${String(index).padStart(6, "0")}`;
}

function generateProductName(category: string): string {
  const names = productNames[category as keyof typeof productNames] || productNames.Electronics;
  const baseName = randomChoice(names);
  const variants = ["Pro", "Plus", "Elite", "Premium", "Standard", "Basic", "Deluxe", "Ultra"];
  return `${baseName} ${randomChoice(variants)}`;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.order.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("👥 Creating users...");
  const admin1 = await prisma.user.create({
    data: {
      email: "admin1@super-shop.com",
      role: "ADMIN",
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: "admin2@super-shop.com",
      role: "ADMIN",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: "customer1@super-shop.com",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "customer2@super-shop.com",
      role: "CUSTOMER",
    },
  });

  console.log(`✅ Created 4 users (2 ADMIN, 2 CUSTOMER)`);

  // Create inventory items (2500 items)
  console.log("📦 Creating inventory items...");
  const inventoryItems = [];
  let skuIndex = 1;

  for (const category of productCategories) {
    const itemsPerCategory = 250;
    for (let i = 0; i < itemsPerCategory; i++) {
      const name = generateProductName(category);
      const stock = randomInt(0, 500);
      const reorderThreshold = randomInt(5, 50);

      inventoryItems.push({
        sku: generateSKU(category, skuIndex++),
        name: `${name} - ${category}`,
        stock,
        reorderThreshold,
      });
    }
  }

  // Insert in batches of 500
  for (let i = 0; i < inventoryItems.length; i += 500) {
    const batch = inventoryItems.slice(i, i + 500);
    await prisma.inventoryItem.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`  Created ${Math.min(i + 500, inventoryItems.length)}/${inventoryItems.length} inventory items`);
  }

  console.log(`✅ Created ${inventoryItems.length} inventory items`);

  // Create orders (4000 orders distributed across customers)
  console.log("🛒 Creating orders...");
  const orders = [];
  const customers = [customer1, customer2];
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 4000; i++) {
    const customer = randomChoice(customers);
    const status = randomChoice(orderStatuses);
    const total = randomFloat(10, 5000);
    const createdAt = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));

    orders.push({
      customerId: customer.id,
      status,
      total,
      createdAt,
    });
  }

  // Insert in batches of 500
  for (let i = 0; i < orders.length; i += 500) {
    const batch = orders.slice(i, i + 500);
    await prisma.order.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`  Created ${Math.min(i + 500, orders.length)}/${orders.length} orders`);
  }

  console.log(`✅ Created ${orders.length} orders`);

  // Create issues (400 issues distributed across customers)
  console.log("🐛 Creating issues...");
  const issues = [];
  const issueDescriptions = [
    "Payment was charged twice",
    "Order not delivered on time",
    "Product arrived damaged",
    "Wrong item received",
    "Cannot login to account",
    "Refund not processed",
    "Order status not updating",
    "Product quality issue",
    "Missing items from order",
    "Billing address incorrect",
    "Shipping address incorrect",
    "Product not as described",
    "Website not loading",
    "Password reset not working",
    "Account locked",
    "Order cancellation issue",
    "Discount code not working",
    "Payment method declined",
    "Order tracking not available",
    "Customer service not responding",
  ];

  for (let i = 0; i < 400; i++) {
    const customer = randomChoice(customers);
    const category = randomChoice(issueCategories);
    const status = randomChoice(issueStatuses);
    const description = randomChoice(issueDescriptions);
    const createdAt = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));

    issues.push({
      customerId: customer.id,
      category,
      status,
      description,
      createdAt,
    });
  }

  // Insert in batches of 100
  for (let i = 0; i < issues.length; i += 100) {
    const batch = issues.slice(i, i + 100);
    await prisma.issue.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`  Created ${Math.min(i + 100, issues.length)}/${issues.length} issues`);
  }

  console.log(`✅ Created ${issues.length} issues`);

  // Create discount rules (30 discount rules)
  console.log("💰 Creating discount rules...");
  const discountLabels = [
    "Summer Sale",
    "Winter Clearance",
    "New Customer Discount",
    "Loyalty Reward",
    "Bulk Purchase",
    "Flash Sale",
    "Holiday Special",
    "Member Exclusive",
    "Early Bird",
    "Referral Bonus",
    "Birthday Special",
    "Anniversary Sale",
    "Weekend Deal",
    "Midnight Madness",
    "Clearance Event",
    "VIP Discount",
    "Student Discount",
    "Senior Discount",
    "First Order",
    "Repeat Customer",
  ];

  const discounts = [];
  for (let i = 0; i < 30; i++) {
    const type = randomChoice(discountTypes);
    const value = type === "PERCENTAGE" ? randomFloat(5, 50) : randomFloat(10, 200);
    const active = Math.random() > 0.3; // 70% active

    discounts.push({
      label: `${randomChoice(discountLabels)} ${i + 1}`,
      type,
      value,
      active,
    });
  }

  await prisma.discountRule.createMany({
    data: discounts,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${discounts.length} discount rules`);

  // Summary
  const summary = await prisma.$transaction([
    prisma.user.count(),
    prisma.inventoryItem.count(),
    prisma.order.count(),
    prisma.issue.count(),
    prisma.discountRule.count(),
  ]);

  console.log("\n📊 Database seed summary:");
  console.log(`  Users: ${summary[0]}`);
  console.log(`  Inventory Items: ${summary[1]}`);
  console.log(`  Orders: ${summary[2]}`);
  console.log(`  Issues: ${summary[3]}`);
  console.log(`  Discount Rules: ${summary[4]}`);
  console.log("\n✅ Database seeded successfully!");
  console.log("\n🔐 Login credentials:");
  console.log("  ADMIN:");
  console.log("    - admin1@super-shop.com");
  console.log("    - admin2@super-shop.com");
  console.log("  CUSTOMER:");
  console.log("    - customer1@super-shop.com");
  console.log("    - customer2@super-shop.com");
  console.log("\n💡 Note: You'll need to create these users in Keycloak with matching emails.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

