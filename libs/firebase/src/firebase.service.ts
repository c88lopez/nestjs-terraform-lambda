import { Injectable } from '@nestjs/common';
import { UsersApi } from '@guini/firebase/api/Users';
import { LambdaLogsService } from '@guini/lambda-logs';

import { Profile } from '@rentcheck/types';

type FirebaseDocumentId = string;

@Injectable()
export class FirebaseService {
  constructor(private logger: LambdaLogsService, private usersApi: UsersApi) {}

  async getById(id: FirebaseDocumentId): Promise<Profile> {
    this.logger.log(`at FirebaseService::getById`, { id });

    return this.usersApi.getUser(id);
  }
}
