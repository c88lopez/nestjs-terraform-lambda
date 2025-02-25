data "archive_file" "lambdas_layer" {
  type = "zip"

  source_dir  = "${path.root}/../layers/general"
  output_path = "${path.root}/../layers/general/layer.zip"
}

resource "aws_s3_object" "lambdas_layer" {
  bucket = aws_s3_bucket.lambdas_bucket.id

  key    = local.lambdas_layer_name
  source = data.archive_file.lambdas_layer.output_path

  etag = filemd5(data.archive_file.lambdas_layer.output_path)
}

resource "aws_lambda_layer_version" "lambdas_layer" {
  s3_bucket = aws_s3_bucket.lambdas_bucket.id
  s3_key    = aws_s3_object.lambdas_layer.key

  layer_name = "lambdas-layer"

  compatible_runtimes = ["nodejs18.x"]

  source_code_hash = data.archive_file.lambdas_layer.output_base64sha256
}