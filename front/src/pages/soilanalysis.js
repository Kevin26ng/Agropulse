import { useState, useEffect } from 'react';
import { MapPin, Navigation, Thermometer, Droplets, Loader, Search, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Head from 'next/head';

// Soil Property Card Component
function SoilPropertyCard({ icon, title, value, unit, idealRange, description }) {
  return (
    <div style={{ 
      padding: '1.5rem', 
      background: 'var(--background-color)', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      {icon && <div style={{ marginBottom: '0.5rem' }}>{icon}</div>}
      <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{title}</h3>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--primary-color)' }}>
        {value} {unit}
      </p>
      {idealRange && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Ideal: {idealRange}
        </p>
      )}
      {description && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
    </div>
  );
}

// Main SoilAnalysis component
const SoilAnalysis = () => {
  const [location, setLocation] = useState({
    address: '',
    pincode: '',
    latitude: '',
    longitude: ''
  });
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setLoading(false);
      },
      (error) => {
        setError(`Unable to get your location: ${error.message}`);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  // Convert address to coordinates
  const geocodeAddress = async () => {
    if (!location.address && !location.pincode) {
      setError('Please enter address or pincode');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = `${location.address} ${location.pincode}`.trim();
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 1
        }
      });

      if (response.data.length === 0) {
        throw new Error('Location not found. Please try a different address.');
      }

      const { lat, lon } = response.data[0];
      setLocation(prev => ({
        ...prev,
        latitude: lat,
        longitude: lon
      }));
      
    } catch (error) {
      setError(error.message || 'Failed to geocode address');
    } finally {
      setLoading(false);
    }
  };

  // Fetch soil data
  const fetchSoilData = async () => {
    if (!location.latitude || !location.longitude) {
      setError('Please get your location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock data for demonstration
      setSoilData({
        pH: (6.5 + Math.random() * 1.5).toFixed(1),
        nitrogen: (25 + Math.random() * 50).toFixed(0),
        phosphorous: (15 + Math.random() * 30).toFixed(0),
        potassium: (150 + Math.random() * 100).toFixed(0),
        organicCarbon: (1.2 + Math.random() * 0.8).toFixed(1),
        clay: (20 + Math.random() * 30).toFixed(0),
        sand: (40 + Math.random() * 30).toFixed(0),
        silt: (30 + Math.random() * 20).toFixed(0),
        cec: (15 + Math.random() * 10).toFixed(0)
      });
    } catch (error) {
      setError('Failed to fetch soil data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLocation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Head>
        <title>Soil Analysis - AgriSmart</title>
        <meta name="description" content="Analyze your soil nutrients and get recommendations for better crop yield" />
      </Head>

      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <MapPin size={32} color="var(--primary-color)" />
          <h1 style={{ margin: 0 }}>Soil Analysis</h1>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Location Details</h2>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={location.address}
                onChange={handleInputChange}
                placeholder="Enter your farm address"
              />
            </div>

            <div className="form-group">
              <label>Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={location.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={geocodeAddress}
                disabled={loading}
                className="btn btn-secondary"
              >
                <Search size={18} />
                Find by Address
              </button>

              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="btn btn-primary"
              >
                <Navigation size={18} />
                Use Current Location
              </button>
            </div>
          </div>

          {(location.latitude || location.longitude) && (
            <div style={{ 
              background: 'var(--background-color)', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Coordinates:</h3>
              <p style={{ margin: 0, fontFamily: 'monospace' }}>
                Latitude: {location.latitude}, Longitude: {location.longitude}
              </p>
            </div>
          )}

          <button
            onClick={fetchSoilData}
            disabled={loading || !location.latitude}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <Loader size={18} />
                Analyzing Soil...
              </>
            ) : (
              'Get Soil Analysis'
            )}
          </button>
        </div>

        {error && (
          <div className="card" style={{ 
            background: '#fef2f2', 
            borderColor: '#fecaca',
            color: '#dc2626'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              {error}
            </div>
          </div>
        )}

        {soilData && (
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Soil Analysis Results</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <SoilPropertyCard 
                icon={<Thermometer size={24} />}
                title="pH Level"
                value={soilData.pH}
                unit=""
                idealRange="6.0-7.0"
              />
              
              <SoilPropertyCard 
                title="Nitrogen (N)"
                value={soilData.nitrogen}
                unit="mg/kg"
                idealRange="20-50"
              />
              
              <SoilPropertyCard 
                title="Phosphorous (P)"
                value={soilData.phosphorous}
                unit="mg/kg"
                idealRange="10-30"
              />
              
              <SoilPropertyCard 
                title="Potassium (K)"
                value={soilData.potassium}
                unit="mg/kg"
                idealRange="100-200"
              />
              
              <SoilPropertyCard 
                title="Organic Carbon"
                value={soilData.organicCarbon}
                unit="%"
                idealRange="1.0-2.0"
              />
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem' }}>💡 Crop Recommendations:</h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Based on your soil pH of {soilData.pH}, consider {soilData.pH < 6 ? 'adding lime to raise pH' : soilData.pH > 7.5 ? 'adding sulfur to lower pH' : 'maintaining current pH levels'}</li>
                <li>Nitrogen levels are {soilData.nitrogen < 20 ? 'low' : soilData.nitrogen > 50 ? 'high' : 'optimal'} for most crops</li>
                <li>Phosphorous levels are {soilData.phosphorous < 10 ? 'low' : soilData.phosphorous > 30 ? 'high' : 'optimal'}</li>
                <li>Potassium levels are {soilData.potassium < 100 ? 'low' : soilData.potassium > 200 ? 'high' : 'optimal'}</li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  // This data can be passed to the crop recommendation page
                  localStorage.setItem('soilData', JSON.stringify(soilData));
                  window.location.href = '/crop';
                }}
              >
                Use this data for Crop Recommendation →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// NO getServerSideProps or getStaticProps - using client-side data fetching
export default SoilAnalysis;