import express from 'express';
import axios from 'axios';
import Joi from 'joi';
import { basicTemplateFrom } from '../services/templates.js';

const router = express.Router();

const schema = Joi.object({
  prompt: Joi.string().min(5).required(),
  appType: Joi.string().valid('Mobile App', 'Website', 'WebApp').required(),
  template: Joi.string().valid('Portfolio', 'Business', 'Blog', 'E-Commerce').required(),
});

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { prompt, appType, template } = value;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const base = process.env.OPENROUTER_BASE || 'https://openrouter.ai/api/v1';
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

    if (!apiKey) {
      const files = basicTemplateFrom({ prompt, appType, template });
      return res.json({ source: 'fallback', files });
    }

    const system = `You are a code generator. Generate a minimal full-stack app scaffold based on the user's request. Output strictly a JSON object with a 'files' array. Each item: { path: string, content: string }. Include at least: index.html, styles.css, app.js. Do not include explanations.`;

    const user = `App type: ${appType}\nTemplate: ${template}\nPrompt: ${prompt}\nConstraints: Keep it minimal but functional. Vanilla JS only for the generated app layer. Use Tailwind CDN if needed.`;

    const response = await axios.post(`${base}/chat/completions`, {
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.3,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    let text = response?.data?.choices?.[0]?.message?.content || '';
    // Try to parse JSON from the LLM response, fallback otherwise
    let files;
    try {
      const parsed = JSON.parse(text);
      files = parsed.files;
    } catch (e) {
      files = basicTemplateFrom({ prompt, appType, template });
    }

    res.json({ source: 'openrouter', files });
  } catch (err) {
    next(err);
  }
});

export default router;