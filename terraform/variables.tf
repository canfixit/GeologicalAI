variable "aws_region" {
  description = "The AWS region where resources will be created"
  type        = string
  default     = "us-west-1"
}

variable "project_name" {
  description = "The name of the project, used for resource naming"
  type        = string
  default     = "react3goai"
}

variable "environment" {
  description = "The environment (dev, test, prod)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "The domain name for the application (managed by Cloudflare)"
  type        = string
  default     = "react3goai.canfixit.com.au"
}