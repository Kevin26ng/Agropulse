import { useState, useEffect } from 'react';
import { uploadPestImage, checkServerHealth } from '../lib/api';

import { Bug, Upload, AlertCircle, CheckCircle, Loader , Server, ServerOff} from 'lucide-react';

export default function PestDetection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const health = await checkServerHealth();
      setServerStatus(health.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (error) {
      setServerStatus('unhealthy');
    }
  };

  // Accepted file types
  const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file type
    if (!acceptedFileTypes.includes(selectedFile.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, GIF)');
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setError('File size too large. Please select an image under 5MB.');
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await uploadPestImage(formData);
      if (response.success) {
        setResult(response);
      } else {
        setError(response.error || 'Failed to detect pest');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };



 return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Bug size={32} color="var(--primary-color)" />
        <h1 style={{ margin: 0 }}>Pest Detection</h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          background: serverStatus === 'healthy' ? '#10b98120' : '#ef444420',
          color: serverStatus === 'healthy' ? '#10b981' : '#ef4444',
          fontSize: '0.875rem'
        }}>
          {serverStatus === 'healthy' ? <Server size={16} /> : <ServerOff size={16} />}
          Server: {serverStatus === 'healthy' ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="pest-image" style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>
              Upload Pest Image
            </label>
            
            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '12px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
                marginBottom: '1rem'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--primary-color)';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border-color)';
                if (e.dataTransfer.files[0]) {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.files = e.dataTransfer.files;
                  fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }}
            >
              <input
                id="pest-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                required
              />
              
              {preview ? (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '300px',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                  <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Upload size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                  <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                    Drag & drop an image here, or click to browse
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Supported formats: JPEG, PNG, WebP, GIF • Max size: 5MB
                  </p>
                </div>
              )}
            </div>

            <label htmlFor="pest-image" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={20} />
              Choose File
            </label>

            {file && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  marginLeft: '1rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--error-color)',
                  color: 'var(--error-color)',
                  background: 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="btn btn-primary"
            style={{ minWidth: '200px' }}
          >
            {loading ? (
              <>
                <Loader size={20} className="spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Bug size={20} />
                Detect Pest
              </>
            )}
          </button>
        </form>
      </div>

      {result && result.success && (
        <div className="card result-card">
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={48} style={{ marginBottom: '1rem', color: 'white' }} />
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Pest Identified!</h2>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '1rem'
            }}>
              {result.pest}
            </p>
            
            {result.imageUrl && (
              <img 
                src={result.imageUrl} 
                alt={result.pest}
                style={{
                  maxWidth: '300px',
                  borderRadius: '8px',
                  margin: '1rem auto',
                  display: 'block'
                }}
              />
            )}
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '1rem', 
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Recommended Actions:</h3>
              <p style={{ color: 'white', margin: 0 }}>
                View detailed information about {result.pest} and treatment options.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}