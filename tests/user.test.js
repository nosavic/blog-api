const mongoose = require("mongoose");
const User = require("../models/User");
const { faker } = require("@faker-js/faker");

jest.setTimeout(10000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const mongoUri = "mongodb://localhost:27017/test_db"; // Adjust as needed
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("User Model", () => {
  it("should create a new user and hash the password", async () => {
    const email = faker.internet.email();
    const user = new User({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      password: "password123",
    });

    await user.save();

    // Ensure password is hashed
    expect(user.password).not.toBe("password123");

    // Fetch the user again to ensure the hashing process worked
    const foundUser = await User.findOne({ email: email });

    // Ensure the password is hashed
    expect(foundUser.password).not.toBe("password123");

    // Check if password comparison works correctly
    const isMatch = await foundUser.comparePassword("password123");
    expect(isMatch).toBe(true);
  });

  // Test for duplicate email validation
  it("should throw an error when creating a user with a duplicate email", async () => {
    const email = faker.internet.email();

    const user1 = new User({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      password: "password123",
    });

    await user1.save();

    const user2 = new User({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email, // Use the same email as user1
      password: "password456",
    });

    try {
      await user2.save();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error for unique email field
    }
  });

  // Test password comparison with incorrect password
  it("should return false when comparing incorrect password", async () => {
    const email = faker.internet.email();

    const user = new User({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      password: "password123",
    });

    await user.save();

    const isMatch = await user.comparePassword("wrongpassword");
    expect(isMatch).toBe(false); // Password comparison should fail
  });

  // Test if the password is hashed correctly before saving
  it("should hash the password before saving", async () => {
    const email = faker.internet.email();

    const user = new User({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      password: "password123",
    });

    await user.save();

    const foundUser = await User.findOne({ email });

    expect(foundUser).toBeDefined();
    expect(foundUser.password).not.toBe("password123");
    const isMatch = await foundUser.comparePassword("password123");
    expect(isMatch).toBe(true);
  });
});
