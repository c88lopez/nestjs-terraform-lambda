import { Module } from '@nestjs/common';
import { UsersApi } from '@guini/firebase/api/Users';

import { FirebaseService } from './firebase.service';
import { LambdaLogsModule } from '@guini/lambda-logs';

@Module({
  imports: [LambdaLogsModule],
  providers: [FirebaseService, UsersApi],
  exports: [FirebaseService],
})
export class FirebaseModule {}
