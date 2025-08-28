import { useState,useEffect } from 'react';
import { getCropRecommendation } from '../lib/api';
import { Sprout, Thermometer, Droplets, CloudRain } from 'lucide-react';


export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    ph: '',
    rainfall: '',
    temperature: '',
    humidity: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

    // At the top of your crop.js component
const [soilData, setSoilData] = useState(null);

useEffect(() => {
  // Get soil data from localStorage if coming from soil analysis
  const storedSoilData = localStorage.getItem('soilData');
  if (storedSoilData) {
    setSoilData(JSON.parse(storedSoilData));
    // Pre-fill the form with soil data
    setFormData(prev => ({
      ...prev,
      nitrogen: JSON.parse(storedSoilData).nitrogen || '',
      phosphorous: JSON.parse(storedSoilData).phosphorous || '',
      potassium: JSON.parse(storedSoilData).potassium || '',
      ph: JSON.parse(storedSoilData).pH || ''
    }));
  }
}, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await getCropRecommendation(formData);
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, error: 'Failed to get recommendation' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Sprout size={32} color="var(--primary-color)" />
        <h1 style={{ margin: 0 }}>Crop Recommendation</h1>
      </div>

      <div className="form">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Nitrogen (N) ppm</label>
              <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phosphorous (P) ppm</label>
              <input type="number" name="phosphorous" value={formData.phosphorous} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Potassium (K) ppm</label>
              <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>pH Level</label>
              <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>
                <CloudRain size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Rainfall (mm)
              </label>
              <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>
                <Thermometer size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Temperature (°C)
              </label>
              <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>
                <Droplets size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Humidity (%)
              </label>
              <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
            <Sprout size={20} />
            {loading ? 'Analyzing...' : 'Get Recommendation'}
          </button>
        </form>
      </div>

      {result && (
        <div className={`card ${result.success ? 'result-card' : ''}`} style={{ marginTop: '2rem' }}>
          {result.success ? (
            <>
              <h2>🎉 Recommended Crop</h2>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
                {result.prediction}
              </p>
              {result.imageUrl && (
                <img 
                  src={result.imageUrl} 
                  alt={result.prediction} 
                  style={{ 
                    maxWidth: '200px', 
                    borderRadius: '8px', 
                    margin: '1rem auto',
                    display: 'block'
                  }} 
                />
              )}
            </>
          ) : (
            <p style={{ color: 'var(--error-color)', textAlign: 'center' }}>
              ❌ Error: {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}