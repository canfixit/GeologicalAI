variable "aws_region" {
  description = "The AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "The name of the project, used for resource naming"
  type        = string
  default     = "reacttreegoai"
}

variable "ec2_ami" {
  description = "The AMI ID for the EC2 instance (Ubuntu 22.04 LTS)"
  type        = string
  default     = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS in us-east-1
}

variable "ec2_instance_type" {
  description = "The EC2 instance type"
  type        = string
  default     = "t2.medium" # Recommended for running both Node.js and Go
}

variable "ec2_key_name" {
  description = "The key pair name for SSH access to the EC2 instance"
  type        = string
}

variable "git_repo_url" {
  description = "The URL of the Git repository to clone"
  type        = string
  default     = "https://github.com/yourusername/reacttreegoai.git"
}