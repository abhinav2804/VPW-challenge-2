#!/bin/bash
set -e

# Configuration
PROJECT_ID="eternal-calling-478712-j6"
REGION="us-central1"
BACKEND_SERVICE_NAME="vpw-backend"
FRONTEND_SERVICE_NAME="vpw-frontend"
ARTIFACT_REPO="vpw-repo"
ROOT_DIR=$(pwd)

# Set project
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable services
echo "Enabling necessary Google Cloud services..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --quiet

# Create Artifact Registry if it doesn't exist
echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create $ARTIFACT_REPO \
    --repository-format=docker \
    --location=$REGION \
    --description="Voter Journey App Images" \
    --quiet || echo "Repository might already exist, continuing..."

# --- DEPLOY BACKEND ---
echo "Building Backend image..."
cd "$ROOT_DIR/backend"
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/$BACKEND_SERVICE_NAME . --quiet

echo "Deploying Backend to Cloud Run..."
GEMINI_KEY=$(grep GEMINI_KEY .env | cut -d'"' -f2)
GEMINI_FILE_NAME=$(grep GEMINI_FILE_NAME .env | cut -d'"' -f2)

gcloud run deploy $BACKEND_SERVICE_NAME \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/$BACKEND_SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="GEMINI_KEY=$GEMINI_KEY,GEMINI_FILE_NAME=$GEMINI_FILE_NAME" \
    --quiet

# Get the Backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

if [ -z "$BACKEND_URL" ]; then
    echo "ERROR: Failed to capture Backend URL."
    exit 1
fi
echo "Backend deployed at: $BACKEND_URL"

# --- DEPLOY FRONTEND ---
echo "Building Frontend image..."
cd "$ROOT_DIR/frontend"

IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/$FRONTEND_SERVICE_NAME"

# Use cloudbuild.yaml to pass VITE_API_URL
gcloud builds submit . \
    --config cloudbuild.yaml \
    --substitutions=_VITE_API_URL="$BACKEND_URL/api",_IMAGE_NAME="$IMAGE_NAME" \
    --quiet

echo "Deploying Frontend to Cloud Run..."
gcloud run deploy $FRONTEND_SERVICE_NAME \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/$FRONTEND_SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port=80 \
    --quiet

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "------------------------------------------------"
echo "DEPLOYMENT COMPLETE!"
echo "Backend API: $BACKEND_URL/api"
echo "Frontend UI: $FRONTEND_URL"
echo "------------------------------------------------"
