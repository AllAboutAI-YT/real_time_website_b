const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateWebsite, modifyWebsite, extractPartialCode } = require('./openaiService');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Real-Time Website Builder API is running');
});

app.post('/api/generate-website', async (req, res) => {
  console.log('Received generate-website request:', req.body);
  const { description } = req.body;

  if (!description) {
    console.log('Bad request: Description is missing');
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    console.log('Calling OpenAI API...');
    const stream = await generateWebsite(description);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await handleStreamingResponse(stream, res);
  } catch (error) {
    console.error('Error generating website:', error);
    res.status(500).json({ error: 'Failed to generate website', details: error.message });
  }
});

app.post('/api/modify-website', async (req, res) => {
  console.log('Received modify-website request:', req.body);
  const { modificationDescription, currentHtml, currentCss } = req.body;

  if (!modificationDescription || !currentHtml || !currentCss) {
    console.log('Bad request: Missing required fields');
    return res.status(400).json({ error: 'Modification description, current HTML, and current CSS are required' });
  }

  try {
    console.log('Calling OpenAI API for modification...');
    const stream = await modifyWebsite(modificationDescription, currentHtml, currentCss);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await handleStreamingResponse(stream, res);
  } catch (error) {
    console.error('Error modifying website:', error);
    res.status(500).json({ error: 'Failed to modify website', details: error.message });
  }
});

async function handleStreamingResponse(stream, res) {
  let fullResponse = '';
  let currentHtml = '';
  let currentCss = '';

  console.log('Starting to stream response...');
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    
    const newHtml = extractPartialCode(fullResponse, 'html');
    const newCss = extractPartialCode(fullResponse, 'css');
    
    if (newHtml !== currentHtml || newCss !== currentCss) {
      currentHtml = newHtml;
      currentCss = newCss;
      const data = JSON.stringify({ html: currentHtml, css: currentCss });
      console.log('Sending chunk:', data.substring(0, 100) + '...');
      res.write(`data: ${data}\n\n`);
    }
  }

  console.log('Finished streaming response');
  res.write('data: [DONE]\n\n');
  res.end();
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;