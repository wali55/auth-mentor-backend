const { prisma } = require("../utils/database");
const { registerSchema, loginSchema } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

const registerUser = async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, role } = req.body;

    const registerValidation = registerSchema.safeParse({
      email,
      password,
      username,
      firstName,
      lastName,
      role,
    });

    if (!registerValidation.success) {
      return res.status(400).json({ error: "Invalid user input" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password is required" });
    }

    const existingUser = await prisma.user.findUnique({ where: {email} });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email is already exists" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        username,
        firstName,
        lastName,
        role,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.log("Error occur during registration", error);
    return res.status(500).json({ error: "Cannot register user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({error: "Email and password is required"});
    }

    const loginValidation = loginSchema.safeParse({email, password});

    if (!loginValidation.success) {
      return res.status(400).json({error: "Invalid input"});
    }

    const user = await prisma.user.findUnique({where: {email}});

    if (!user) {
      return res.status(401).json({error: "Invalid credentials"});
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({error: "Invalid credentials"});
    }

    const token = jwt.sign({id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});

    return res.status(200).json({
      message: "Login successful",
      user: {id: user.id, email: user.email, role: user.role, username: user.username},
      token
    })
  } catch (error) {
    console.log("Login error", error);
    return res.status(500).json({error: "Server error when login"});
  }
}

const protectedRoute = (req, res) => {
  return res.status(200).json({message: "Entered into the protected route", user: req.user})
}

module.exports = { registerUser, loginUser, protectedRoute };
