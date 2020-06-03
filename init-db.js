// @ts-nocheck
// insert default admin@test.com user with admin password
var coll = db.getCollection("Users");
var reviews = db.getCollection("Reviews");
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
// insert test employee
coll.findOneAndUpdate(
  {
    email: "employee@test.com",
  },
  {
    $set: {
      email: "employee@test.com",
      password_hash:
        "$2b$10$dc/ldJhpg8YyEbNWwaNvqu.muDy9MlwFU5loFR9OONjitGPESV4Nm",
      status: "active",
      roles: ["employee"],
    },
  },
  { upsert: true }
);
// insert mock users
var employees = cat("mock-users.txt").split("\n");
for (var employee of employees) {
  var data = employee.split("\t");
  coll.insert({
    name: data[0],
    email: data[1],
    password_hash: data[2],
    status: "active",
    roles: ["employee"],
  });
  reviews.insert({
    created_at: new Date(),
    employee: data[1],
    assignee: ["employee@test.com"],
  });
}
