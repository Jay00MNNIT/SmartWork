const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/suggestions', authMiddleware, async (req, res) => {
    try {
        const { category } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

        // Category descriptions for better AI understanding 
        const categoryDescriptions = {
            study: 'academic studying, homework, assignments, exam preparation',
            work: 'professional work tasks, meetings, projects, deadlines',
            personal: 'personal development, health, fitness, self care',
            shopping: 'buying groceries, online shopping, making shopping lists',
            other: 'general daily tasks, errands, miscellaneous activities'
        };

        const categoryDesc = categoryDescriptions[category] || 'general tasks';

        const prompt = `Generate 5 realistic and specific task suggestions for a student.
        Category: ${category} (${categoryDesc})

        Return ONLY a valid JSON array with exactly this format, no other text before or after:
        [
            {
                "title": "Specific task title here",
                "description": "Brief helpful description here",
                "priority": "high",
                "estimatedTime": "1 hour",
                "category": "${category}"
            },
            {
                "title": "Another specific task title",
                "description": "Brief helpful description",
                "priority": "medium",
                "estimatedTime": "30 mins",
                "category": "${category}"
            },
            {
                "title": "Third task title",
                "description": "Brief helpful description",
                "priroity": "low",
                "estimatedTime": "45 mins",
                "category": "${category}"
            },
            {
                "title": "Fourth task title",
                "description": "Brief helpful description",
                "priroity": "medium",
                "estimatedTime": "2 hours",
                "category": "${category}"
            },
            {
                "title": "Fifth task title",
                "description": "Brief helpful description",
                "priority": "high",
                "estimatedTime": "1 hour 30 mins",
                "category": "${category}"
            }
        ]`;

        // Auto retry 3 times 
        let result;
        let retries = 3;
        while (retries > 0) {
            try {
                console.log(`Calling Gemini API... (attempts left: ${retries})`);
                result = await model.generateContent(prompt);
                break;
            } catch (retryError) {
                retries--;
                if (retries === 0) throw retryError;
                console.log(`Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        const response = await result.response;
        const text = response.text();

        // Parse JSON
        let cleanText = text
            .replace(/```json/g, '')
            .replace(/```/g,'')
            .trim();

        // Find JSON array in response
        const jsonStart = cleanText.indexOf('[');
        const jsonEnd = cleanText.lastIndexOf(']') + 1;
        if (jsonStart === -1 || jsonEnd === 0) {
            throw new Error('No JSON array found in response');
        }
        cleanText = cleanText.substring(jsonStart, jsonEnd);
        const suggestions = JSON.parse(cleanText);

        res.json({ suggestions });

    } catch (error) {
        console.error('AI Route Error:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;