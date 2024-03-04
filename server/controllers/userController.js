import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, username } = req.body;
  const saltRounds = 10;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = Jwt.sign({ id: createdUser.id }, process.env.SECRETKEY, {
      expiresIn: "1h",
    });

    res.header("Authorization", token).send(token);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   try {
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user)
//       return res.status(401).json({ message: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid email or password" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ token });

//     // Successful login:
//     console.log("Login successful!");
//     res.json(user); // Return user data if needed
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).send("User not found");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  const token = Jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRETKEY,
    {
      expiresIn: "1h",
    }
  );
  console.log(token);
  res.header("Authorization", token).send(token);
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = parseFloat(req.user.id);
    console.log(id);
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, username: true, email: true }, // Exclude password
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
