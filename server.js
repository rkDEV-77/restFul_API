import express from "express";
import validateData from "./middleWare.js";

// creating an Express application instance
const app = express();
const PORT = 5100;
app.use(express.json());

// Dummy Data of Users
// let users = [];
let users = [
  {
    id: "1",
    firstName: "Anshika",
    lastName: "Agarwal",
    hobby: "Teaching",
  },
  {
    id: "2",
    firstName: "Rohan",
    lastName: "Mehta",
    hobby: "Photography",
  },
  {
    id: "3",
    firstName: "Ishita",
    lastName: "Verma",
    hobby: "Reading",
  },
  {
    id: "4",
    firstName: "Aarav",
    lastName: "Sharma",
    hobby: "Gaming",
  },
  {
    id: "5",
    firstName: "Neha",
    lastName: "Patel",
    hobby: "Cooking",
  },
  {
    id: "6",
    firstName: "Siddharth",
    lastName: "Kapoor",
    hobby: "Cycling",
  },
  {
    id: "7",
    firstName: "Kavya",
    lastName: "Singh",
    hobby: "Painting",
  },
  {
    id: "8",
    firstName: "Yash",
    lastName: "Gupta",
    hobby: "Swimming",
  },
  {
    id: "9",
    firstName: "Priya",
    lastName: "Reddy",
    hobby: "Dancing",
  },
  {
    id: "10",
    firstName: "Tanmay",
    lastName: "Joshi",
    hobby: "Traveling",
  },
];

// Middleware to Log Details
app.use((req, res, next) => {
  const startTime = Date.now(); // to track response time

  // 'finish' event fires when response is sent
  res.on("finish", () => {
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;
    const duration = Date.now() - startTime;

    // log the details of each request (e.g., time, method, URL, statuscode, duration)
    console.log(
      `[${new Date().toLocaleString()}] ${method} ${url} -> ${status} (${duration}ms)`
    );
  });

  next(); // Pass control to next middleware or route handler
});

// Root Route : {This will show when you open LOCALHOST:5100 }
app.get("/", async(req, res) => {
  res.send({ message: "This RESTful API assignment involved building a user management system using Node.js and Express. It supports CRUD operations via HTTP methods like GET, POST, PUT, and DELETE. The API uses proper status codes (200, 201, 400, 404, 500) and includes error handling. Testing was done using ThunderClient, verifying responses and request handling. The project helped understand REST architecture, middleware usage, and API testing tools for backend development." });
});

// Route: Fetch the list of all users
app.get("/users", (req, res) => {
  // if(!req.body) return res.status(400).json({message:"Users Not Found"})

  try {
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

     res.status(200).json({
    message: "List of All Users",
    data: users,
  });
  } catch (error) {
     console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
 
});

// Route: Fetch details of a specific user by ID
app.get("/users/:id", async(req, res) => {
  const id = req.params.id;
   const user = users.filter((user) => user.id == id);

  try {
     if (!user) return res.status(404).json({ message: "User Not Found" });

  res.status(200).json({
    message: `SuccessFully Retrived User with id ${id}`,
    data: user,
  });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }

 
});


// Required fields for user creation (POST and PUT)
const userRequiredFields = ['firstName', 'lastName', 'hobby'];

//  Route: Add a new user
app.post("/user", validateData(userRequiredFields), async(req, res) => {
  //   console.log(req.body);

  // if(!req.body) return res.json({message: "Input User Data"})

  const { firstName, lastName, hobby } = req.body;

  //   Validating fields
  // if (!firstName || !lastName || !hobby) {
  //   return res.status(400).json({ message: "Missing user data" });
  // }



  //   Creating new user
  const newUser = {
    id: Math.random() * 101,
    firstName: firstName,
    lastName: lastName,
    hobby: hobby,
  };

  users.push(newUser);

  res.status(201).json({
    message: `New User Added SuccesFully with Id: ${newUser.id}`,
    newUser: newUser,
    AllUsers: users,
  });

  //   res.send(users);
});

// Route: Update details of an existing user(PUT)
app.put("/user/:id",validateData(userRequiredFields), async(req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, hobby } = req.body;
  const user = users.find((user) => user.id == userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Only update fields that are provided
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (hobby !== undefined) user.hobby = hobby;

  res.status(200).json({
    message: `User with id-${userId} updated successfully`,
    user,
    users,
  });
});

// Route: Update details of an existing user Partially(PATCH)
app.patch("/user/:id", async(req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, hobby } = req.body;
  const user = users.find((user) => user.id == userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Only update fields that are provided
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (hobby !== undefined) user.hobby = hobby;

  res.status(200).json({
    message: `User with id-${userId} updated successfully`,
    user,
    users,
  });
});



// Route: Delete a user by ID
app.delete("/user/:id", async(req, res) => {
  const userId = req.params.id;

  if (!userId) return res.status(404).json({ message: "Invalid User Id" });

  const restUsers = users.filter((user) => user.id != userId);

  users = restUsers;

  res.status(200).json({
    message: `User with id-${userId} Deleted successfully`,
    users: restUsers,
  });
});

// Server Running at this PORT
app.listen(PORT, (req, res) => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
