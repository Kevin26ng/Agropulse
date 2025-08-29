import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Sprout,
  FlaskConical,
  Bug,
  CloudRain,
  Thermometer,
  Droplets,
  User,
  MapPin,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Simulate fetching real data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate realistic data based on current date/time
        const now = new Date();
        const currentHour = now.getHours();
        const isDaytime = currentHour > 6 && currentHour < 18;
        
        setDashboardData({
          farmStats: {
            totalCrops: Math.floor(Math.random() * 20) + 5,
            fertilizerUsed: Math.floor(Math.random() * 100) + 20,
            pestsDetected: Math.floor(Math.random() * 10),
            soilTests: Math.floor(Math.random() * 15) + 5
          },
          weather: {
            temperature: Math.floor(Math.random() * 35) + 15,
            humidity: Math.floor(Math.random() * 60) + 30,
            rainfall: (Math.random() * 10).toFixed(1),
            condition: isDaytime ? 'Sunny' : 'Clear'
          },
          recentActivities: [
            { 
              action: 'Crop Recommendation', 
              details: 'Wheat suggested for current soil conditions', 
              time: '2 hours ago',
              success: true
            },
            { 
              action: 'Fertilizer Analysis', 
              details: 'Nitrogen levels optimized for corn field', 
              time: '1 day ago',
              success: true
            },
            { 
              action: 'Pest Detection', 
              details: 'Aphids identified and treatment recommended', 
              time: '2 days ago',
              success: false
            },
            { 
              action: 'Soil Analysis', 
              details: 'pH levels balanced in northern section', 
              time: '3 days ago',
              success: true
            }
          ],
          recommendations: [
            'Water crops in the morning for better absorption',
            'Consider rotating crops next season',
            'Add organic compost to improve soil quality'
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download a simple report
      const reportContent = `AgriSmart Farm Report\nGenerated: ${new Date().toLocaleString()}\n\n` +
        `Total Crops: ${dashboardData?.farmStats.totalCrops}\n` +
        `Fertilizer Used: ${dashboardData?.farmStats.fertilizerUsed}kg\n` +
        `Pests Detected: ${dashboardData?.farmStats.pestsDetected}\n` +
        `Soil Tests: ${dashboardData?.farmStats.soilTests}`;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `farm-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <BarChart3 size={32} color="var(--primary-color)" />
          <h1 style={{ margin: 0 }}>Farm Dashboard</h1>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <BarChart3 size={32} color="var(--primary-color)" />
        <h1 style={{ margin: 0 }}>Farm Dashboard</h1>
        <div style={{ 
          marginLeft: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--background-color)',
          borderRadius: '20px',
          fontSize: '0.9rem'
        }}>
          <Clock size={16} />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Farm Statistics Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Sprout size={24} color="var(--primary-color)" />
            <h3 style={{ margin: 0 }}>Total Crops</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{dashboardData?.farmStats.totalCrops}</span>
            <span style={{ color: 'var(--success-color)', fontSize: '1.2rem' }}>+2</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Active cultivations</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <FlaskConical size={24} color="var(--primary-color)" />
            <h3 style={{ margin: 0 }}>Fertilizer Used</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{dashboardData?.farmStats.fertilizerUsed}</span>
            <span style={{ fontSize: '1.5rem' }}>kg</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>This season</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Bug size={24} color="var(--primary-color)" />
            <h3 style={{ margin: 0 }}>Pests Detected</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: dashboardData?.farmStats.pestsDetected > 0 ? 'var(--error-color)' : 'var(--success-color)' }}>
              {dashboardData?.farmStats.pestsDetected}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Under control</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <MapPin size={24} color="var(--primary-color)" />
            <h3 style={{ margin: 0 }}>Soil Tests</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{dashboardData?.farmStats.soilTests}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Completed analysis</p>
        </div>
      </div>

      {/* Weather and Activities Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* Weather Card */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <CloudRain size={20} />
            Current Weather
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer size={16} />
                Temperature
              </span>
              <strong>{dashboardData?.weather.temperature}°C</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={16} />
                Humidity
              </span>
              <strong>{dashboardData?.weather.humidity}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Rainfall</span>
              <strong>{dashboardData?.weather.rainfall}mm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Condition</span>
              <strong>{dashboardData?.weather.condition}</strong>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dashboardData?.recentActivities.map((activity, index) => (
              <div key={index} style={{ 
                padding: '1rem',
                background: 'var(--background-color)',
                borderRadius: '8px',
                borderLeft: `4px solid ${activity.success ? 'var(--success-color)' : 'var(--error-color)'}`
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{activity.action}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {activity.details}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations and Export */}
      <div className="dashboard-grid">
        {/* Recommendations */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>💡 Smart Recommendations</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {dashboardData?.recommendations.map((recommendation, index) => (
              <li key={index} style={{ marginBottom: '0.75rem', lineHeight: '1.5' }}>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        {/* Export Section */}
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>Export Farm Report</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
  Download a comprehensive report of your farm&apos;s performance and recommendations
</p>

          <button 
            className="btn btn-primary" 
            onClick={handleExport}
            disabled={exporting}
            style={{ minWidth: '200px' }}
          >
            {exporting ? (
              <>
                <div className="spin" style={{ display: 'inline-block', marginRight: '0.5rem' }}>⏳</div>
                Generating...
              </>
            ) : (
              <>
                <Download size={20} />
                Download Report
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}