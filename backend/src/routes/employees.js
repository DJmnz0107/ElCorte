import express from "express";

const router = express.Router();

import employeesController from "../controllers/employeesController.js";

router.route("/")
.get(employeesController.getEmployees)
.post(employeesController.createEmployee);

router.route("/:id")
.put(employeesController.updateEmployee)
.delete(employeesController.deleteEmployee);

export default router;