provider "aws" {
  region = var.aws_region
}

# VPC for the application
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Public subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

# Route table for public subnet
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.project_name}-public-route-table"
  }
}

# Route table association
resource "aws_route_table_association" "public_route_table_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

# Security group for EC2 instance
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-sg"
  description = "Security group for ${var.project_name} application"
  vpc_id      = aws_vpc.app_vpc.id

  # No inbound rules - AWS Console will be used for SSH via Session Manager
  # This configuration doesn't allow direct IP access to any port

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

# IAM role for SSM access
resource "aws_iam_role" "ssm_role" {
  name = "${var.project_name}-ssm-role"
  
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# Attach SSM policy to role
resource "aws_iam_role_policy_attachment" "ssm_policy" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Create instance profile
resource "aws_iam_instance_profile" "ssm_instance_profile" {
  name = "${var.project_name}-ssm-instance-profile"
  role = aws_iam_role.ssm_role.name
}

# EC2 instance
resource "aws_instance" "app_instance" {
  ami                    = var.ec2_ami
  instance_type          = var.ec2_instance_type
  key_name               = var.ec2_key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  subnet_id              = aws_subnet.public_subnet.id
  iam_instance_profile   = aws_iam_instance_profile.ssm_instance_profile.name

  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  user_data = <<-EOF
              #!/bin/bash
              # Update the system
              apt-get update -y
              apt-get upgrade -y

              # Install necessary dependencies
              apt-get install -y curl git nginx

              # Install AWS SSM Agent
              mkdir -p /tmp/ssm
              cd /tmp/ssm
              wget https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/debian_amd64/amazon-ssm-agent.deb
              dpkg -i amazon-ssm-agent.deb
              systemctl enable amazon-ssm-agent
              systemctl start amazon-ssm-agent

              # Install Node.js
              curl -sL https://deb.nodesource.com/setup_20.x | bash -
              apt-get install -y nodejs

              # Install Go
              wget https://go.dev/dl/go1.20.linux-amd64.tar.gz
              tar -C /usr/local -xzf go1.20.linux-amd64.tar.gz
              echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
              source /etc/profile

              # Clone the application
              mkdir -p /var/www
              cd /var/www
              git clone ${var.git_repo_url} ${var.project_name}
              cd ${var.project_name}

              # Install Node.js dependencies
              npm install

              # Setup systemd service for Node.js app
              cat > /etc/systemd/system/nodejs-app.service << 'EOL'
              [Unit]
              Description=Node.js Application
              After=network.target

              [Service]
              User=root
              WorkingDirectory=/var/www/${var.project_name}
              ExecStart=/usr/bin/npm run start
              Restart=always
              RestartSec=10
              StandardOutput=syslog
              StandardError=syslog
              SyslogIdentifier=nodejs-app

              [Install]
              WantedBy=multi-user.target
              EOL

              # Setup systemd service for Go app
              cat > /etc/systemd/system/go-app.service << 'EOL'
              [Unit]
              Description=Go Application
              After=network.target

              [Service]
              User=root
              WorkingDirectory=/var/www/${var.project_name}/server
              ExecStart=/usr/local/go/bin/go run main.go
              Restart=always
              RestartSec=10
              StandardOutput=syslog
              StandardError=syslog
              SyslogIdentifier=go-app

              [Install]
              WantedBy=multi-user.target
              EOL

              # Configure Nginx
              cat > /etc/nginx/sites-available/default << 'EOL'
              server {
                  listen 80;
                  listen [::]:80;
                  server_name _;

                  location / {
                      proxy_pass http://localhost:5000;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade $http_upgrade;
                      proxy_set_header Connection 'upgrade';
                      proxy_set_header Host $host;
                      proxy_cache_bypass $http_upgrade;
                  }
              }
              EOL

              # Enable and start services
              systemctl daemon-reload
              systemctl enable nginx
              systemctl enable nodejs-app
              systemctl enable go-app
              systemctl start nginx
              systemctl start nodejs-app
              systemctl start go-app
              EOF

  tags = {
    Name = "${var.project_name}"
  }
}

# Elastic IP
resource "aws_eip" "app_eip" {
  instance = aws_instance.app_instance.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-eip"
  }
}

# Output the public IP
output "public_ip" {
  value = aws_eip.app_eip.public_ip
}

# Output the instance ID
output "instance_id" {
  value = aws_instance.app_instance.id
}