import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js"

export const newTask = async (req, res, next) => {
  const { title, description } = req.body;

  await Task.create({
    title, description, user: req.user
  })
  res.status(201).json({
    success: true,
    message: "Task added Successfully",
  })

}

export const getMyTask = async (req, res, next) => {
  const userid = req.user._id;

  const tasks = await Task.find({ user: userid });
  res.status(200).json({
    success: true,
    tasks,
  })

};

export const UpdateTask = async (req, res, next) => {

  const task = await Task.findById(req.params.id);
  task.isCompleted = !task.isCompleted;
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  await task.save();

  res.status(200).json({
    success: true,
    message: "Task Updated!"
  })

};

export const DeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    await task.deleteOne();
    res.status(200).json({
      success: true,
      message: "Task Deleted!"
    });
  } catch (error) {
    // Handle other potential errors
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
