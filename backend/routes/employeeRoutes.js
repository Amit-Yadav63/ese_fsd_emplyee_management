import express from 'express';
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee
} from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createEmployee).get(getEmployees);
router.get('/search', searchEmployees);
router.route('/:id').put(updateEmployee).delete(deleteEmployee);

export default router;

