resource "aws_s3_bucket" "lambdas_bucket" {
  bucket = "nestjs-lambdas-bucket"

  tags = {
    Name        = "Bucket for Lambdas zip files"
    Environment = "All"
  }
}