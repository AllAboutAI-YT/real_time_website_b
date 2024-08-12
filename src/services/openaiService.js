const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export async function generateWebsite(description, onUpdate) {
  try {
    console.log('Sending request to:', `${BACKEND_URL}/api/generate-website`);
    const response = await fetch(`${BACKEND_URL}/api/generate-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      throw new Error('Network response was not ok');
    }

    await handleStreamingResponse(response, onUpdate);
  } catch (error) {
    console.error('Error calling backend API:', error);
    throw new Error('Failed to generate website: ' + error.message);
  }
}

export async function modifyWebsite(modificationDescription, currentHtml, currentCss, onUpdate) {
  try {
    console.log('Sending request to:', `${BACKEND_URL}/api/modify-website`);
    const response = await fetch(`${BACKEND_URL}/api/modify-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modificationDescription, currentHtml, currentCss }),
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      throw new Error('Network response was not ok');
    }

    await handleStreamingResponse(response, onUpdate);
  } catch (error) {
    console.error('Error calling backend API:', error);
    throw new Error('Failed to modify website: ' + error.message);
  }
}

async function handleStreamingResponse(response, onUpdate) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          return;
        }
        try {
          const parsedData = JSON.parse(data);
          onUpdate(parsedData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
  }
}