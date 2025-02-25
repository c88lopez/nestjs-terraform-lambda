resource "aws_default_vpc" "default_vpc" {
  tags = {
    Name = "Default VPC"
  }
}

resource "aws_subnet" "a" {
  vpc_id            = aws_default_vpc.default_vpc.id
  availability_zone = "sa-east-1a"
  cidr_block        = "172.31.0.0/20"

  tags = {
    Name = "a"
  }
}

resource "aws_subnet" "b" {
  vpc_id            = aws_default_vpc.default_vpc.id
  availability_zone = "sa-east-1b"
  cidr_block        = "172.31.16.0/20"

  tags = {
    Name = "b"
  }
}

resource "aws_subnet" "c" {
  vpc_id            = aws_default_vpc.default_vpc.id
  availability_zone = "sa-east-1c"
  cidr_block        = "172.31.32.0/20"

  tags = {
    Name = "c"
  }
}

resource "aws_security_group" "default" {
  name        = "default"
  description = "default VPC security group"
  vpc_id      = aws_default_vpc.default_vpc.id
}

resource "aws_db_subnet_group" "default" {
  name       = "postgres-subnet-group"
  subnet_ids = [aws_subnet.a.id, aws_subnet.b.id, aws_subnet.c.id]
}