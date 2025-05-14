# CI/CD Setup Guide for React3GoAI

This guide will help you set up the necessary AWS and GitHub configuration for automatic deployments.

## AWS Setup for GitHub Actions

For secure access to AWS, we'll use IAM Roles for GitHub Actions. This is the recommended approach as it avoids long-lived access keys.

### 1. Create an IAM OIDC Identity Provider for GitHub Actions

```bash
# Install AWS CLI and authenticate first

# Create the OIDC provider
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### 2. Create an IAM Role for GitHub Actions

Create a file named `trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<YOUR_AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>:*"
        }
      }
    }
  ]
}
```

Create a file named `permissions-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::react3goai-frontend-*",
        "arn:aws:s3:::react3goai-frontend-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:GetFunction",
        "lambda:UpdateFunctionConfiguration",
        "apigateway:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": "terraform:*",
      "Resource": "*"
    }
  ]
}
```

Create the IAM role:

```bash
aws iam create-role \
  --role-name GithubActionsReact3GoAI \
  --assume-role-policy-document file://trust-policy.json

aws iam put-role-policy \
  --role-name GithubActionsReact3GoAI \
  --policy-name DeploymentPermissions \
  --policy-document file://permissions-policy.json
```

Save the ARN of the role, it will look like:
`arn:aws:iam::<YOUR_AWS_ACCOUNT_ID>:role/GithubActionsReact3GoAI`

## GitHub Repository Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

2. Add the following secrets:

   - `AWS_ROLE_ARN`: The ARN of the IAM role you created
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token (if using cache invalidation)
   - `CLOUDFLARE_ZONE_ID`: Your Cloudflare zone ID (if using cache invalidation)

## Manual Initial Deployment

For the first deployment, you may want to run Terraform locally to create the initial infrastructure:

```bash
cd terraform
terraform init
terraform apply
```

## Customizing the Workflow

The workflow file (`deploy.yml`) is set to trigger on pushes to the `main` branch. If your default branch is different (e.g., `master`), update the workflow file accordingly.

You can also trigger deployments manually through the GitHub UI using the "workflow_dispatch" trigger.

## Troubleshooting

If you encounter issues with the GitHub Actions workflow:

1. Check the workflow run logs in the GitHub Actions tab
2. Verify that the IAM role has the necessary permissions
3. Ensure the secrets are correctly set up in the GitHub repository