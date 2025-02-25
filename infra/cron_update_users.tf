data "archive_file" "lambda_update_users" {
  type = "zip"

  source_dir  = "${path.root}/../dist"
  output_path = "${path.root}/../dist/lambda.zip"
}

resource "aws_s3_object" "lambda_update_users" {
  bucket = aws_s3_bucket.lambdas_bucket.id

  key    = local.lambda_function_name_update_users
  source = data.archive_file.lambda_update_users.output_path

  etag = filemd5(data.archive_file.lambda_update_users.output_path)
}

resource "aws_lambda_function" "lambda_update_users" {
  function_name = local.lambda_function_name_update_users

  s3_bucket = aws_s3_bucket.lambdas_bucket.id
  s3_key    = aws_s3_object.lambda_update_users.key

  memory_size = 128
  runtime     = "nodejs18.x"
  handler     = "src/crons/updateUsers/main.handler"

  timeout = 30

  source_code_hash = data.archive_file.lambda_update_users.output_base64sha256

  role = aws_iam_role.lambda_update_users.arn

  layers = [aws_lambda_layer_version.lambdas_layer.arn]

  vpc_config {
    subnet_ids         = [aws_subnet.a.id, aws_subnet.b.id, aws_subnet.c.id]
    security_group_ids = [aws_security_group.allow_all_traffic.id]
  }

  environment {
    variables = {
      DATABASE_HOST     = aws_db_instance.aws_db_postgres.address
      DATABASE_PORT     = aws_db_instance.aws_db_postgres.port
      DATABASE_USERNAME = aws_db_instance.aws_db_postgres.username
      DATABASE_PASSWORD = aws_db_instance.aws_db_postgres.password
      DATABASE_NAME     = aws_db_instance.aws_db_postgres.db_name
      DATABASE_SCHEMA   = "public"
    }
  }
}

resource "aws_cloudwatch_log_group" "update_users_log_group" {
  name = "/aws/lambda/${aws_lambda_function.lambda_update_users.function_name}"

  retention_in_days = 1
}

resource "aws_iam_role" "lambda_update_users" {
  name = "lambda_update_users_iam_role"

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

resource "aws_iam_role_policy_attachment" "update_users_basic_exec" {
  role       = aws_iam_role.lambda_update_users.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "update_users_vpc_access" {
  role       = aws_iam_role.lambda_update_users.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_cloudwatch_event_rule" "cron_update-users-rule" {
  name                = "cron-update-users-rule"
  description         = "cron rule for update users lambda"
  schedule_expression = "rate(1 minute)"
}

resource "aws_cloudwatch_event_target" "cron-rule-lambda" {
  rule      = aws_cloudwatch_event_rule.cron_update-users-rule.name
  target_id = "update_users"
  arn       = aws_lambda_function.lambda_update_users.arn

  input_transformer {
    input_template = <<JSON
    {
      "version": <version>,
      "id": <id>,
      "detail-type": <detail-type>,
      "source": <source>,
      "account": <account>,
      "time": <time>,
      "region": <region>,
      "resources": [],
      "detail": {
        "entity": "units"
      }
    }
    JSON
    input_paths = {
      "account" : "$.account",
      "detail-type" : "$.detail-type",
      "id" : "$.id",
      "region" : "$.region",
      "source" : "$.source",
      "time" : "$.time",
      "version" : "$.version"
    }
  }
}

resource "aws_lambda_permission" "allow_even" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_update_users.function_name
  principal     = "events.amazonaws.com"

  source_arn = aws_cloudwatch_event_rule.cron_update-users-rule.arn
}