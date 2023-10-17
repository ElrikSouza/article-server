import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/auth/hash/hash.service';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepo: Repository<UsersEntity>,
  ) {}

  async saveUser(signUpDTO: SignUpDto) {
    const newUser = this.userRepo.create({
      ...signUpDTO,
    });

    await this.userRepo.insert(newUser);
  }

  async findById(id: string): Promise<UsersEntity | null> {
    const user = await this.userRepo.findOneBy({ id });

    return user ?? null;
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    const user = await this.userRepo.findOneBy({ email });

    return user ?? null;
  }

  async findByIdOrThrow(id: string): Promise<UsersEntity> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByEmailOrThrow(email: string): Promise<UsersEntity> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
