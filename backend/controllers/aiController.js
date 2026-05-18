import axios from 'axios';
import Employee from '../models/Employee.js';

const HR_PROMPT = `You are an HR AI assistant. Analyze employee data and provide:
- promotion recommendation
- training suggestions
- performance feedback
- ranking insight`;

export const getRecommendations = async (req, res, next) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      res.status(500);
      throw new Error('OPENROUTER_API_KEY is missing');
    }

    const employees = req.body.employees?.length
      ? req.body.employees
      : await Employee.find().sort({ performanceScore: -1, experience: -1 }).lean();

    if (!employees.length) {
      res.status(400);
      throw new Error('Employee data is required for AI recommendations');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: HR_PROMPT },
          {
            role: 'user',
            content: `Analyze these employees and return concise, structured recommendations:\n${JSON.stringify(employees, null, 2)}`
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'AI Employee Performance Analytics'
        }
      }
    );

    const recommendation = response.data?.choices?.[0]?.message?.content || 'No recommendation returned.';

    res.json({
      success: true,
      recommendation,
      usage: response.data?.usage
    });
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;
    res.status(error.response?.status || res.statusCode || 500);
    next(new Error(message));
  }
};

