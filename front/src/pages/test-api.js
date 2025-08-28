import { useEffect } from 'react';

export default function TestAPI() {
  useEffect(() => {
    const testEndpoints = async () => {
      const endpoints = [
        '/api/health',
        '/api/crop-predict',
        '/api/fertilizer-predict',
        '/api/pest-predict'
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://localhost:5000${endpoint}`);
          console.log(`${endpoint}: ${response.status}`);
        } catch (error) {
          console.log(`${endpoint}: ERROR - ${error.message}`);
        }
      }
    };
    
    testEndpoints();
  }, []);

  return <div>Check browser console for API endpoint status</div>;
}