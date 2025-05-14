provider "aws" {
  region = var.aws_region
}

#------------------------------------------------------------------------------
# S3 Bucket for Frontend Static Website Hosting (for Cloudflare)
#------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${random_id.suffix.hex}"

  tags = {
    Name        = "${var.project_name}-frontend"
    Environment = var.environment
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_ownership_controls" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "frontend" {
  depends_on = [
    aws_s3_bucket_ownership_controls.frontend,
    aws_s3_bucket_public_access_block.frontend,
  ]
  bucket = aws_s3_bucket.frontend.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "frontend" {
  depends_on = [aws_s3_bucket_public_access_block.frontend]
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# CORS configuration for S3 bucket
resource "aws_s3_bucket_cors_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["https://${var.domain_name}", "http://${var.domain_name}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

#------------------------------------------------------------------------------
# IAM Role for Lambda Functions
#------------------------------------------------------------------------------
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_logs" {
  name = "${var.project_name}-lambda-logs"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

#------------------------------------------------------------------------------
# Lambda Functions for API Endpoints
#------------------------------------------------------------------------------
# Terrain Data Lambda
resource "aws_lambda_function" "terrain_data" {
  function_name    = "${var.project_name}-terrain-data"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = "${path.module}/lambda/terrain-data.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/terrain-data.zip")
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.lambda_logs
  ]
}

# AI Insights Lambda
resource "aws_lambda_function" "insights" {
  function_name    = "${var.project_name}-insights"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = "${path.module}/lambda/insights.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/insights.zip")
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.lambda_logs
  ]
}

# Analysis Lambda
resource "aws_lambda_function" "analysis" {
  function_name    = "${var.project_name}-analysis"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = "${path.module}/lambda/analysis.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/analysis.zip")
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.lambda_logs
  ]
}

#------------------------------------------------------------------------------
# API Gateway
#------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["https://${var.domain_name}", "http://${var.domain_name}"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "api" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.environment
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_logs.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      path           = "$context.path"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
    })
  }

  default_route_settings {
    throttling_burst_limit = 100
    throttling_rate_limit  = 50
  }
}

# CloudWatch Log Group for API Access Logs
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/apigateway/${var.project_name}-api-${var.environment}"
  retention_in_days = 7
}

# Terrain Data Integration
resource "aws_apigatewayv2_integration" "terrain_data" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.terrain_data.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "terrain_data" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /api/terrain"
  target    = "integrations/${aws_apigatewayv2_integration.terrain_data.id}"
}

# Insights Integration
resource "aws_apigatewayv2_integration" "insights" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.insights.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "insights" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /api/insights"
  target    = "integrations/${aws_apigatewayv2_integration.insights.id}"
}

# Analysis Integration
resource "aws_apigatewayv2_integration" "analysis" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.analysis.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "analysis" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /api/insights/analyze"
  target    = "integrations/${aws_apigatewayv2_integration.analysis.id}"
}

# Lambda Permissions for API Gateway
resource "aws_lambda_permission" "terrain_data" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.terrain_data.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/api/terrain"
}

resource "aws_lambda_permission" "insights" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.insights.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/api/insights"
}

resource "aws_lambda_permission" "analysis" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analysis.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/api/insights/analyze"
}

#------------------------------------------------------------------------------
# Outputs
#------------------------------------------------------------------------------
output "s3_website_endpoint" {
  description = "S3 website endpoint for Cloudflare CNAME"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend uploads"
  value       = aws_s3_bucket.frontend.bucket
}

output "s3_website_url" {
  description = "S3 website URL (for testing before Cloudflare setup)"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "api_gateway_url" {
  description = "API Gateway URL for Cloudflare CNAME"
  value       = aws_apigatewayv2_stage.api.invoke_url
}

output "cloudflare_setup_instructions" {
  description = "Instructions for Cloudflare setup"
  value       = <<-EOT
    === Cloudflare DNS Setup Instructions ===
    
    1. For the main domain (${var.domain_name}):
       - Type: CNAME
       - Name: ${var.domain_name}
       - Target: ${aws_s3_bucket_website_configuration.frontend.website_endpoint}
       - Proxy status: Proxied (enabled)
    
    2. For the API subdomain (api.${var.domain_name}):
       - Type: CNAME
       - Name: api
       - Target: ${replace(aws_apigatewayv2_stage.api.invoke_url, "https://", "")}
       - Proxy status: Proxied (enabled)
    
    3. Configure Cloudflare SSL/TLS:
       - SSL/TLS mode: Full or Flexible
       - Always Use HTTPS: On
       - Automatic HTTPS Rewrites: On
  EOT
}