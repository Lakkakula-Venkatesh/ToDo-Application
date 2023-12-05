const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task");

router.post("/create", taskController.createTask);
router.post("/update", taskController.updateTask);
router.delete("/delete", taskController.deleteTask);
router.get("/all", taskController.allTasks);
router.post("/complete", taskController.completeTask)
router.get("/:task_id", taskController.getTask);

module.exports = router;
