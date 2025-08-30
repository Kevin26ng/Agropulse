FROM python:3.7-slim-bullseye

WORKDIR /app

# Install system dependencies for TensorFlow and other packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirement-docker.txt .

# FIX: Install compatible versions for TensorFlow 1.14.0
RUN pip install --no-cache-dir \
    protobuf==3.9.2 \
    numpy==1.16.4 \
    h5py==2.10.0

# Install other Python dependencies
RUN pip install --no-cache-dir -r requirement-docker.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p static/user_uploaded static/crop static/pest_info

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONPATH=/app
ENV PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python

# Start with single worker (TensorFlow 1.x doesn't work well with multiple workers)
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--timeout", "120", "--workers", "1"]