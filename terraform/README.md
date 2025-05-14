# Terraform Configuration for React3GoAI Project - Serverless Architecture with Cloudflare

This directory contains Terraform configurations to deploy the React3GoAI application using a serverless architecture on AWS, with Cloudflare handling DNS and SSL/TLS.

## Architecture Overview

This deployment uses a fully serverless approach:

- **Frontend**: Static website hosted on S3 directly (no CloudFront)
- **Backend**: API Gateway + Lambda functions
- **DNS & CDN**: Cloudflare for DNS, SSL/TLS, and CDN functionality
- **Cost Efficiency**: Pay only for what you use, no idle servers

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) installed (version >= 1.0.0)
- AWS credentials configured (Access Key and Secret Access Key)
- Node.js and npm for packaging Lambda functions
- Cloudflare account with the domain already added and configured

## Configuration

1. Copy the example variables file to create your own configuration:

```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Edit `terraform.tfvars` to customize your deployment:

```
aws_region   = "us-east-1"                    # AWS region for deployment
project_name = "reactthreegoai"               # Name used for resource naming
environment  = "prod"                         # Environment (dev, test, prod)
domain_name  = "reactthreegoai.canfixit.com.au"  # Domain managed by Cloudflare
```

### Domain Name Configuration

The infrastructure is configured to work with Cloudflare managing the domain `reactthreegoai.canfixit.com.au`. After deployment:

1. You'll create CNAME records in Cloudflare pointing to:
   - The S3 website endpoint for the main domain
   - The API Gateway endpoint for the API subdomain

2. Cloudflare will handle:
   - DNS routing
   - SSL/TLS certificates
   - CDN caching
   - DDoS protection

## Preparing Lambda Functions

Before deploying, you need to package the Lambda functions:

```bash
cd terraform
chmod +x build_lambdas.sh
./build_lambdas.sh
```

This will create the necessary zip files for Lambda deployment.

## Frontend Deployment

After Terraform creates the S3 bucket, you'll need to build and upload your frontend:

```bash
# Build your React application
cd ../client
npm run build

# Upload to S3 (replace BUCKET_NAME with the output from Terraform)
aws s3 sync ./build/ s3://BUCKET_NAME/ --delete
```

## Deployment Steps

1. Initialize Terraform:

```bash
cd terraform
terraform init
```

2. Plan the deployment:

```bash
terraform plan
```

3. Apply the configuration:

```bash
terraform apply
```

4. After successful deployment, the S3 website endpoint and API Gateway URL will be displayed in the output:

```
s3_website_endpoint = "reactthreegoai-frontend-xxxx.s3-website-us-east-1.amazonaws.com"
s3_website_url = "http://reactthreegoai-frontend-xxxx.s3-website-us-east-1.amazonaws.com"
api_gateway_url = "https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod"
```

The output will also include detailed instructions for configuring your Cloudflare DNS settings:

```
cloudflare_setup_instructions = 
  === Cloudflare DNS Setup Instructions ===
  
  1. For the main domain (reactthreegoai.canfixit.com.au):
     - Type: CNAME
     - Name: reactthreegoai.canfixit.com.au
     - Target: reactthreegoai-frontend-xxxx.s3-website-us-east-1.amazonaws.com
     - Proxy status: Proxied (enabled)
  
  2. For the API subdomain (api.reactthreegoai.canfixit.com.au):
     - Type: CNAME
     - Name: api
     - Target: xxxxxxxx.execute-api.us-east-1.amazonaws.com
     - Proxy status: Proxied (enabled)
  
  3. Configure Cloudflare SSL/TLS:
     - SSL/TLS mode: Full or Flexible
     - Always Use HTTPS: On
     - Automatic HTTPS Rewrites: On
```

## Cleaning Up

To destroy all resources created by Terraform:

```bash
terraform destroy
```

## Serverless Architecture Benefits

- **Cost-Efficient**: Pay only for the actual requests processed
- **Auto-Scaling**: Handles traffic spikes without manual intervention
- **Low Maintenance**: No servers to manage or patch
- **High Availability**: Built-in redundancy across availability zones

## Security Considerations

- S3 bucket is configured for website hosting with appropriate permissions
- CloudFront provides HTTPS by default
- API Gateway includes CORS configuration
- Lambda functions have minimal IAM permissions
- CloudWatch logs are enabled for all components

## Monitoring and Logs

- Lambda function logs are available in CloudWatch Logs
- API Gateway access logs are stored in CloudWatch Logs
- CloudFront access logs can be enabled for the distribution

## Next Steps for Production

For a production environment, consider:

1. Adding a custom domain with AWS Certificate Manager
2. Implementing a CI/CD pipeline for automated deployment
3. Setting up DynamoDB for persistent storage
4. Adding authentication with Amazon Cognito
5. Implementing caching strategies for API responses

## Troubleshooting

If your application doesn't start properly after deployment:

1. SSH into the instance:
```bash
ssh -i your-key.pem ubuntu@xx.xx.xx.xx
```

2. Check the application logs:
```bash
sudo journalctl -u nodejs-app.service
sudo journalctl -u go-app.service
```

3. Check if services are running:
```bash
sudo systemctl status nodejs-app
sudo systemctl status go-app
```