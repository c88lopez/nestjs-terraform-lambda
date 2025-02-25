terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  backend "s3" {
    bucket = "nestjs-terraform-lambda-bucket"
    key    = "terraform-state"
    region = "sa-east-1"
  }

  required_version = ">= 1.5.0"
}

provider "aws" {
  region = "sa-east-1"
}