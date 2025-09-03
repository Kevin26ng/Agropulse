// For production - Render backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
                     (process.env.NODE_ENV === 'production' 
                      ? 'https://agropulsee.onrender.com/api'  
                      : 'http://localhost:5000/api'                        
                      );


async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    // If response is HTML (error page), throw a custom error
    if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    // If response is JSON but has error
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Parse JSON response
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // If response is not JSON, throw error
  throw new Error('Expected JSON response from server');
}

export async function getCropRecommendation(params) {
  try {
    const response = await fetch(`${API_BASE_URL}/crop-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getFertilizerRecommendation(params) {
  try {
    const response = await fetch(`${API_BASE_URL}/fertilizer-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadPestImage(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/pest-predict`, {
      method: 'POST',
      body: formData
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
}

// Health check function
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
       if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    // Try to parse JSON, but handle non-JSON responses gracefully
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // If not JSON, assume server is healthy if it responds
    return { status: 'healthy', message: 'Server is responding' };
    
  } catch (error) {
    console.error('Server health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
}