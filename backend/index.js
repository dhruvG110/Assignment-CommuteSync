const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDb = require("./db/connect");
const TaskModel = require("./db/tashSchema");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectDb();

app.get("/", (req, res) => {
  res.send("Task Manager API Running 🚀");
});

app.post("/create-task", async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }  

    if (!["High", "Medium", "Low"].includes(priority)) {
      return res.status(401).json({
        message: "Invalid Priority",
      });
    }

    const task = await TaskModel.create({
      title,
      description,
      priority,
    });

    return res.status(201).json({
      message: "Task Created Successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.get("/get-all-tasks", async (req, res) => {
  try {
    const tasks = await TaskModel.find();

    if (tasks.length === 0) {
      return res.status(200).json({
        message: "No Tasks Found",
        tasks: [],
      });
    }

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.put("/update-tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, priority, completed } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    if (!["High", "Medium", "Low"].includes(priority)) {
      return res.status(400).json({
        message: "Invalid Priority",
      });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be true or false",
      });
    }

    const task = await TaskModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        priority,
        completed,
      },
      {
        returnDocument:'after'
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    return res.status(200).json({
      message: "Task Updated Successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    return res.status(200).json({
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});