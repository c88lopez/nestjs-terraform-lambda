import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LambdaLogsModule } from '@guini/lambda-logs';
import Service from './service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: ['test'].includes(process.env['ENVIRONMENT']),
      envFilePath: '../../.test.env',
    }),
    LambdaLogsModule,
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DATABASE_HOST'),
    //     port: +configService.get('DATABASE_PORT'),
    //     username: configService.get('DATABASE_USERNAME'),
    //     password: configService.get('DATABASE_PASSWORD'),
    //     database: configService.get('DATABASE_NAME'),
    //     schema: configService.get('DATABASE_SCHEMA'),
    //     entities: [User],
    //     synchronize: false,
    //   }),
    //   dataSourceFactory: async (options) =>
    //     new DataSource(options).initialize(),
    // }),
    // TypeOrmModule.forFeature([User]),
  ],
  providers: [Service],
  controllers: [],
})
export default class UsersModule {}
