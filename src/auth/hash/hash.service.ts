import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashService {
  async hash(data: string): Promise<string> {
    return hash(data, 12);
  }

  async compareDataToHash(data: string, hash: string): Promise<boolean> {
    return compare(data, hash);
  }
}
