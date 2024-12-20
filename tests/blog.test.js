const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const Blog = require("../models/Blog");
const request = require("supertest");
const app = require("../app");

jest.setTimeout(10000);

describe("User API", () => {
  let userId;
  let token;
  let blogId;

  beforeAll(async () => {
    const email = faker.internet.email();
    const password = "password123";

    const user = new User({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email,
      password,
    });

    await user.save();
    userId = user._id;

    const response = await request(app)
      .post("/api/users/signin")
      .send({ email, password });

    expect(response.status).toBe(200);
    token = response.body.token;

    const blog = new Blog({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      author: userId,
      tags: [faker.lorem.word()],
      body: faker.lorem.paragraphs(2),
    });
    await blog.save();
    blogId = blog._id;
  });

  afterAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create a new user", async () => {
    const newUser = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: "password123",
    };

    const response = await request(app).post("/api/users/signup").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully!");
  });

  it("should not create a user with an existing email", async () => {
    const existingUser = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: "existing.email@example.com",
      password: "password123",
    };

    await request(app).post("/api/users/signup").send(existingUser);

    const response = await request(app)
      .post("/api/users/signup")
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(
      /E11000 duplicate key error collection:.*email_1 dup key:.*existing.email@example.com/
    );
  });

  it("should create a new blog", async () => {
    const newBlog = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      author: userId,
      tags: [faker.lorem.word(), faker.lorem.word()],
      body: faker.lorem.paragraphs(3),
    };

    const response = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Blog created successfully!");
    expect(response.body.blog).toHaveProperty("_id");
    expect(response.body.blog.title).toBe(newBlog.title);
  });

  it("should update the blog title, body, and state", async () => {
    const updatedBlogData = {
      title: "Updated Blog Title",
      body: "This is the updated content of the blog.",
      state: "published",
    };
    const response = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlogData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", blogId.toString());
    expect(response.body.title).toBe(updatedBlogData.title);
    expect(response.body.body).toBe(updatedBlogData.body);
    expect(response.body.state).toBe(updatedBlogData.state);
  });

  it("should not create a blog without a title", async () => {
    const newBlog = {
      description: "This blog has no title.",
      body: "Some content here.",
    };

    const response = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe("Title is required");
  });

  it("should not create a blog without being authenticated", async () => {
    const newBlog = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      author: userId,
      tags: [faker.lorem.word(), faker.lorem.word()],
      body: faker.lorem.paragraphs(3),
    };

    const response = await request(app).post("/api/blogs").send(newBlog);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication required");
  });
});
