const { searchUsersByEmail, getUserByEmail, createUser, updateLastLogin, updateUserRole } = require("../models/userModel");

const searchUsers = async (req, res) => {
  const emailQuery = req.query.email;

  if (!emailQuery) {
    return res.status(400).send({ message: "Missing email query" });
  }

  try {
    const users = await searchUsersByEmail(emailQuery);
    res.status(200).send(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).send({ message: "Error searching users" });
  }
};


const getUserRole = async (req, res) => {
  // const email = req.params.email;
  const email = req.query.email;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(200).send({ role: "user" });
    }

    res.status(200).send({ role: user.role || "user" });
  } catch (error) {
    console.error("Error getting user role:", error);
    res.status(200).send({ role: "user" });
  }
};

// ➕ Create or Update User
const createOrUpdateUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    const userExists = await getUserByEmail(email);

    // 🔄 If user exists → update last login
    if (userExists) {
      await updateLastLogin(email);

      return res.status(200).send({
        message: "User already exists",
        inserted: false,
      });
    }

    // ➕ If new user → create
    const newUser = {
      ...req.body,
      created_at: new Date(),
      last_log_in: new Date(),
    };

    const result = await createUser(newUser);

    res.status(201).send({
      message: "User created successfully",
      inserted: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).send({ message: "Failed to create user" });
  }
};

const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // ✅ Validate role
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).send({ message: "Invalid role" });
  }

  try {
    const result = await updateUserRole(id, role);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: `User role updated to ${role}`,
      result,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send({ message: "Failed to update user role" });
  }
};

const checkUserExists = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email);

    res.status(200).send({
      exists: !!user,
    });

  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).send({ message: "Server error" });
  }
};



module.exports = {
  searchUsers,
  getUserRole,
  createOrUpdateUser,
  changeUserRole,


  checkUserExists
};