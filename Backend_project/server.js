const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI =
  "mongodb+srv://shiwangi349_db_user:Shiw7870%40%23@cluster0.5pebc06.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/courses", require("./routes/courses"));
app.use("/api/users", require("./routes/users"));
app.use("/api/quizzes", require("./routes/quizzes"));

const User = require("./models/User");
const Course = require("./models/Course");
const Quiz = require("./models/Quiz");

app.get("/admin", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    res.render("admin", {
      title: "Admin Dashboard",
      body: "",
      stats: {
        totalUsers,
        totalCourses,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.render("users", {
      title: "User Management - Edemy Admin",
      users: users,
    });
  } catch (error) {
    console.error("Users page error:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/admin/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.render("courses", {
      title: "Course Management - Edemy Admin",
      courses: courses,
    });
  } catch (error) {
    console.error("Courses page error:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/admin/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    const courses = await Course.find().select("_id title").sort({ title: 1 });

    res.render("quizzes", {
      title: "Quiz Management - Edemy Admin",
      quizzes: quizzes,
      courses: courses,
    });
  } catch (error) {
    console.error("Quizzes page error:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/admin/courses/:courseId/quizzes", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    const quizzes = await Quiz.find({ courseId: req.params.courseId }).sort({
      createdAt: -1,
    });

    res.render("course-quizzes", {
      title: `${course.title} - Quiz Management - Edemy Admin`,
      course: course,
      quizzes: quizzes,
    });
  } catch (error) {
    console.error("Course quizzes page error:", error);
    res.status(500).send("Server Error");
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
