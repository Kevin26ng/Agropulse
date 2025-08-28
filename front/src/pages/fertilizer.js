import { useState } from 'react';
import { getFertilizerRecommendation } from '../lib/api';

export default function FertilizerRecommendation() {
  const [formData, setFormData] = useState({
    cropname: '',
    nitrogen: '',
    phosphorous: '',
    potassium: ''
  });
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Crop Recommendation</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nitrogen (N):</label>
          <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} required />
        </div>
        {/* Add similar fields for other inputs */}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Get Recommendation'}
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>Recommended Crop: {result.prediction}</h2>
          <img src={result.pred} alt={result.prediction} />
        </div>
      )}
    </div>
  );
}