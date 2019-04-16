// Dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

// Implementing Sign Up operation
async function signup(parent, args, context, info) {
  // 1. Encrypt the user password with bcryptjs
  const password = await bcrypt.hash(args.password, 10);
  // 2. Use prisma to store the new user
  const user = await context.prisma.createUser({ ...args, password });

  // 3. generate a JWT with a signed APP_SECRET
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  // 4. Return the token and the user in an object
  return {
    token,
    user
  };
}

// Implementing Login operation
async function login(parent, args, context, info) {
  // 1. Retrieve the existing user by email
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }
  // 2. Compare the passwords
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invlaid Password");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  // 3. return the token and user info
  return {
    token,
    user
  };
}

function post(parent, args, context, info) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

module.exports = {
  signup,
  login,
  post
};
