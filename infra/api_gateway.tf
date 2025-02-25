resource "aws_apigatewayv2_api" "nestjs-api" {
  name          = "nestjs-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id = aws_apigatewayv2_api.nestjs-api.id
  name   = "$default"

  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_log_group.arn
    format = jsonencode({
      "requestId" : "$context.requestId", "ip" : "$context.identity.sourceIp",
      "requestTime" : "$context.requestTime",
      "httpMethod" : "$context.httpMethod", "routeKey" : "$context.routeKey",
      "status" : "$context.status", "protocol" : "$context.protocol",
      "responseLength" : "$context.responseLength",
      "errorMessage" : "$context.error.message",
      "errorMessageIntegration" : "$context.integration.error"
    })
  }
}

resource "aws_apigatewayv2_deployment" "api_deployment" {
  api_id = aws_apigatewayv2_api.nestjs-api.id

  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    redeployment = sha1(join(",", tolist([
      jsonencode(aws_apigatewayv2_integration.lambda_users_integration),
      jsonencode(aws_apigatewayv2_route.users_get_all_route),
      jsonencode(aws_apigatewayv2_route.users_get_by_id_route),
      jsonencode(aws_apigatewayv2_route.users_create_route),
    ])))
  }
}

resource "aws_cloudwatch_log_group" "api_log_group" {
  name = "/aws/apigatewayv2/${aws_apigatewayv2_api.nestjs-api.name}"

  retention_in_days = 1
}