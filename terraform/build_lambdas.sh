#!/bin/bash

# Create terraform/lambda directory if it doesn't exist
mkdir -p lambda

echo "Building Lambda functions..."

# Create zip files for each Lambda function
echo "Building terrain-data Lambda..."
cd lambda/terrain-data
zip -r ../terrain-data.zip .
cd ../..

echo "Building insights Lambda..."
cd lambda/insights
zip -r ../insights.zip .
cd ../..

echo "Building analysis Lambda..."
cd lambda/analysis
zip -r ../analysis.zip .
cd ../..

echo "All Lambda functions built successfully."