resource "aws_db_instance" "aws_db_postgres" {
  allocated_storage      = 10
  db_name                = "mydb"
  identifier             = "mydb"
  engine                 = "postgres"
  engine_version         = "14.8"
  instance_class         = "db.t3.micro"
  username               = "foo"
  password               = "foobarbaz"
  skip_final_snapshot    = true
  publicly_accessible    = true
  parameter_group_name   = aws_db_parameter_group.default_postgres_14.name
  apply_immediately      = true
  vpc_security_group_ids = [aws_security_group.allow_all_traffic.id]
  db_subnet_group_name   = aws_db_subnet_group.default.name
}

resource "aws_db_parameter_group" "default_postgres_14" {
  name   = "default-parameter-group-postgres14"
  family = "postgres14"
}

resource "aws_security_group" "allow_all_traffic" {
  name        = "postgres"
  description = "Allow Postgres 5432"
  vpc_id      = aws_default_vpc.default_vpc.id

  ingress {
    description = "Allow Postgres 5432"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["${local.cristian-ip}/32"]
  }

  ingress {
    description = "Allow Postgres 5432"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    self        = true
  }

  egress {
    description = "Allow Postgres 5432"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["${local.cristian-ip}/32"]
  }

  egress {
    description = "Allow Postgres 5432"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    self        = true
  }

  ingress {
    description = "Allow Lambda inbound"
    from_port   = 0
    to_port     = 0
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow Lambda outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
