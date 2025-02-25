import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'mydb.cphu2bmnhlld.sa-east-1.rds.amazonaws.com',
  port: 5432,
  username: 'foo',
  password: 'foobarbaz',
  database: 'mydb',
  schema: 'public',
  synchronize: false,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: ['dist/db/migrations/**/*.js'],
});
