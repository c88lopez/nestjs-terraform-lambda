import admin = require('firebase-admin');

import { Injectable } from '@nestjs/common';
import { LambdaLogsService } from '@guini/lambda-logs';
import { Profile } from '@rentcheck/types';

if (!admin.apps.length) {
  admin.initializeApp({});
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

@Injectable()
export class UsersApi {
  constructor(private logger: LambdaLogsService) {}

  async getUser(id: string): Promise<Profile | undefined> {
    try {
      this.logger.log('in UsersApi');

      const documentSnapshot = await admin
        .firestore()
        .collection('users')
        .doc(id)
        .get()
        .then((result) => {
          if (result.exists) return result.data() as Profile;
          return undefined;
        })
        .catch(() => {
          return undefined;
        });

      this.logger.log('doc snap', documentSnapshot);

      return documentSnapshot;
    } catch (error) {
      this.logger.error(`Unable to retrieve user: ${error.message}`);
    }

    return undefined;
  }
}
