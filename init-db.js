// @ts-nocheck
// insert default admin@test.com user with admin password
var coll = db.getCollection("Users");
coll.findOneAndUpdate(
  {
    email: "admin@test.com",
  },
  {
    $set: {
      email: "admin@test.com",
      password_hash:
        "$2b$10$ZxNLgRGg/5M6WWjRsx0uVOMcIeGERMKVpJT4RrKNDsHprOt2wK7kO",
      status: "active",
      roles: ["admin"],
    },
  },
  { upsert: true }
);
