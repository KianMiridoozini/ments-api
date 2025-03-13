import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";

// Project imports
import { productModel } from "../models/productModel";
import { userModel } from "../models/userModel";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../repository/database";
import { faker } from "@faker-js/faker";

dotenvFlow.config();

/**
 * Seed the database with data
 */
export async function seed() {
  try {
    await connectToDatabase();

    await deleteAllData();
    await seedData();
    console.log("Seeding process completed successfully...");
    process.exit();
  } catch (err) {
    console.log("Error Seeding data: " + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Delete all data from the database
 */
export async function deleteAllData() {
  await productModel.deleteMany();
  await userModel.deleteMany();
  console.log("Cleared data successfully...");
}

/**
 * Seed data into the database
 */
export async function seedData() {
  // Pre-hash the password for all users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("12345678", salt);

  // Generate multiple users
  const numberOfUsers = 5;
  const users = [];
  for (let i = 0; i < numberOfUsers; i++) {
    const user = new userModel({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
    });
    await user.save();
    users.push(user);
  }

  // Generate multiple products with a loop
  const numberOfProducts = 20;
  const products = [];
  for (let i = 0; i < numberOfProducts; i++) {
    // Select a random user for the _createdBy field
    const randomUser = users[Math.floor(Math.random() * users.length)];

    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      imageURL: "https://picsum.photos/500/500",
      price: faker.commerce.price({ min: 5, max: 5000 }),
      stock: faker.number.int({ min: 0, max: 200 }),
      isOnDiscount: faker.datatype.boolean(),
      discountPct: faker.number.int({ min: 0, max: 100 }),
      isHidden: false,
      _createdBy: randomUser.id,
    });
  }

  await productModel.insertMany(products);
  console.log("Seeded data successfully...");
}

// start the actual seeding
seed();
