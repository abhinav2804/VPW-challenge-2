# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV WORKDIR=/app

# Set the working directory in the container
WORKDIR ${WORKDIR}

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the specific service code
COPY filesearch/ ./filesearch/

# We'll expect the .env file to be mounted or environment variables passed at runtime
# Set default entrypoint as python to allow running any of the scripts
ENTRYPOINT ["python"]
