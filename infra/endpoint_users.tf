data "archive_file" "lambda_users" {
  type = "zip"

  source_dir  = "${path.root}/../dist"
  output_path = "${path.root}/../dist/lambda.zip"
}

resource "aws_s3_object" "lambda_users" {
  bucket = aws_s3_bucket.lambdas_bucket.id

  key    = local.lambda_function_name_users
  source = data.archive_file.lambda_users.output_path

  etag = filemd5(data.archive_file.lambda_users.output_path)
}

resource "aws_lambda_function" "lambda_users" {
  function_name = local.lambda_function_name_users

  s3_bucket = aws_s3_bucket.lambdas_bucket.id
  s3_key    = aws_s3_object.lambda_users.key

  memory_size = 512
  runtime     = "nodejs18.x"
  handler     = "src/users/main.handler"

  timeout = 20

  source_code_hash = data.archive_file.lambda_users.output_base64sha256

  role = aws_iam_role.lambda_users.arn

  layers = [aws_lambda_layer_version.lambdas_layer.arn]

  vpc_config {
    subnet_ids         = [aws_subnet.a.id, aws_subnet.b.id, aws_subnet.c.id]
    security_group_ids = [aws_security_group.allow_all_traffic.id, aws_security_group.default.id]
  }

  environment {
    variables = {
      DATABASE_HOST     = aws_db_instance.aws_db_postgres.address
      DATABASE_PORT     = aws_db_instance.aws_db_postgres.port
      DATABASE_USERNAME = aws_db_instance.aws_db_postgres.username
      DATABASE_PASSWORD = aws_db_instance.aws_db_postgres.password
      DATABASE_NAME     = aws_db_instance.aws_db_postgres.db_name
      DATABASE_SCHEMA   = "public"

      GOOGLE_APPLICATION_CREDENTIALS = "service-account-dev.json"
    }
  }
}

resource "aws_cloudwatch_log_group" "users_log_group" {
  name = "/aws/lambda/${aws_lambda_function.lambda_users.function_name}"

  retention_in_days = 1
}

resource "aws_iam_role" "lambda_users" {
  name = "lambda_users_iam_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "users_basic_exec" {
  role       = aws_iam_role.lambda_users.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "users_vpc_access" {
  role       = aws_iam_role.lambda_users.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_apigatewayv2_integration" "lambda_users_integration" {
  api_id           = aws_apigatewayv2_api.nestjs-api.id
  integration_uri  = aws_lambda_function.lambda_users.invoke_arn
  integration_type = "AWS_PROXY"

  connection_type        = "INTERNET"
  integration_method     = "POST"
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "users_get_all_route" {
  api_id    = aws_apigatewayv2_api.nestjs-api.id
  route_key = "GET /users"

  target = "integrations/${aws_apigatewayv2_integration.lambda_users_integration.id}"
}

resource "aws_apigatewayv2_route" "users_get_by_id_route" {
  api_id    = aws_apigatewayv2_api.nestjs-api.id
  route_key = "GET /users/{id}"

  target = "integrations/${aws_apigatewayv2_integration.lambda_users_integration.id}"
}

resource "aws_apigatewayv2_route" "users_create_route" {
  api_id    = aws_apigatewayv2_api.nestjs-api.id
  route_key = "POST /users"

  target = "integrations/${aws_apigatewayv2_integration.lambda_users_integration.id}"
}

resource "aws_lambda_permission" "users_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_users.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_apigatewayv2_api.nestjs-api.execution_arn}/*/*"
}