import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: 'owl-fina',
        clientEmail: 'your-client-email',
        privateKey: 'your-private-key'.replace(/\\n/g, '\n'),
      }),
    });
  }

  async verifyToken(token: string) {
    return admin.auth().verifyIdToken(token);
  }
}