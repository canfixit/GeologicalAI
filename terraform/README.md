# Terraform Configuration for ReactTreeGoAI Project

This directory contains Terraform configurations to deploy the ReactTreeGoAI application to AWS EC2.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) installed (version >= 1.0.0)
- AWS credentials configured (Access Key and Secret Access Key)
- An EC2 key pair for SSH access
- Git repository with your application code

## Configuration

1. Copy the example variables file to create your own configuration:

```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Edit `terraform.tfvars` to customize your deployment:

```
aws_region       = "us-east-1"              # AWS region for deployment
project_name     = "reacttreegoai"          # Name used for resource naming
ec2_ami          = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 LTS AMI (us-east-1)
ec2_instance_type = "t2.medium"             # Instance type
ec2_key_name     = "your-key-name"          # Replace with your EC2 key pair name
git_repo_url     = "https://github.com/yourusername/reacttreegoai.git"  # Replace with your repo URL
```

## State Management (Optional)

For team environments, it's recommended to use remote state storage. Uncomment and configure the S3 backend in `backend.tf` if needed.

## Deployment

1. Initialize Terraform:

```bash
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

4. After successful deployment, the public IP address will be displayed in the output:

```
public_ip = "xx.xx.xx.xx"
```

You can access your application at: `http://xx.xx.xx.xx`

## Cleaning Up

To destroy all resources created by Terraform:

```bash
terraform destroy
```

## Architecture

The deployment includes:

- A VPC with public subnet
- Security group allowing traffic on ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (Node.js app), and 8080 (Go server)
- An EC2 instance with Ubuntu 22.04 LTS
- Elastic IP address for stable public access
- Automatic setup of Node.js, Go, and Nginx
- Systemd services for both the Node.js and Go applications

## Security Considerations

- The security group allows SSH access from any IP (0.0.0.0/0). For production, restrict this to your specific IP address.
- Consider using AWS Certificate Manager and HTTPS for production deployments.
- Store sensitive data (like API keys) in AWS Secrets Manager or as environment variables, not in the application code.

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