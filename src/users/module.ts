import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LambdaLogsModule } from '@guini/lambda-logs';
import { LambdaResponseModule } from '@guini/lambda-response';
import { LambdaValidatorModule } from '@guini/lambda-validator';

import { FirebaseModule } from '@guini/firebase';

import Controller from './controller';
import Service from './service';
import ErrorHandler from './errorHandler';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: ['test'].includes(process.env['ENVIRONMENT']),
      envFilePath: '../../.test.env',
    }),
    LambdaLogsModule,
    LambdaResponseModule,
    LambdaValidatorModule,
    FirebaseModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        schema: configService.get('DATABASE_SCHEMA'),
        entities: [User],
        synchronize: false,
      }),
      dataSourceFactory: async (options) =>
        new DataSource(options).initialize(),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [Service, ErrorHandler],
  controllers: [Controller],
})
export default class UsersModule {}
