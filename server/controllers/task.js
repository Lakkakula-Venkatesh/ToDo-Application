require("dotenv").config({ path: "vars/.env" });
const Task = require("../models/task");
const User = require("../models/user");

const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

const SALT_ROUNDS = process.env.SALT_ROUNDS;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const createTask = async (req, res) => {
  const { token, name, description, endDate } = req.query;

  const { id, email } = decryptToken(token);

  const newTask = new Task({
    bookedUserId: id,
    bookedUserEmail: email,
    name: name,
    description: description,
    createdAt: new Date(),
    endDate: endDate
  });

  const savedTask = await newTask.save();

  res.status(200).send({
    message: "Task Created succesfully",
    task: savedTask
  });
};

const updateTask = async (req, res) => {
  const { taskId } = req.query;
};

const deleteTask = async (req, res) => {};

const completeTask = async (req, res) => {
  const { taskId } = req.body;
  const objectId = new ObjectId(taskId);
  console.log(objectId);
  const task = await Task.findOne({ _id: objectId });
  console.log(task, "Task");
  task.completed = true;

  task.save();

  res.status(200).send({ message: "Marked task as closed" });
};

const allTasks = async (req, res) => {
  const { id, email } = decryptToken(req.query.token);

  const user = await User.find({ email: email, id: id });

  if (user === undefined)
    res.status(400).send({ message: "Invalid credentials" });

  const tasks = await Task.find({ bookedUserEmail: email, completed: false });

  res.status(200).send({ tasks: tasks });
};

const getTask = async (req, res) => {};

const decryptToken = token => jwt.verify(token, TOKEN_SECRET);

module.exports = {
  createTask,
  completeTask,
  updateTask,
  deleteTask,
  allTasks,
  getTask
};
