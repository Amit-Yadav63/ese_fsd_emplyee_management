import Employee from '../models/Employee.js';

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  return String(skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      skills: normalizeSkills(req.body.skills)
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1, experience: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

export const searchEmployees = async (req, res, next) => {
  try {
    const { department, q } = req.query;
    const filter = {};

    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { skills: { $regex: q, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(filter).sort({ performanceScore: -1, experience: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const update = {
      ...req.body
    };

    if (req.body.skills !== undefined) {
      update.skills = normalizeSkills(req.body.skills);
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

