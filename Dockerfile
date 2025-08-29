# Use Python 3.7.0 base image
FROM python:3.7.0-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y build-essential

# Copy requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port (if it's a web app)
EXPOSE 5000

# Run your app
CMD ["python", "app.py"]
