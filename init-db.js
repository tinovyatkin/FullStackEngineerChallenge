// @ts-nocheck
// insert default admin@test.com user with admin password
db.getCollection("Users").findOneAndUpdate(
  {
    email: "admin@test.com",
  },
  {
    $set: {
      email: "admin@test.com",
      password_hash:
        "$2b$10$9GzU/.fi1mGhv5jMsImIfu3kBILY4RnVrNP6GfJaMjq2/vUCz4yl6",
      status: "active",
      roles: ["admin"],
    },
  },
  { upsert: true }
);
