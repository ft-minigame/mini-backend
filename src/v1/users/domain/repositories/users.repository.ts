import { Repository, DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSources: DataSource) {
    super(User, dataSources.createEntityManager());
  }

  async createAndSave(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    await this.save(user);
    return user;
  }

  async updateById(id: string, updateData: Partial<User>): Promise<User> {
    await this.update(id, updateData);
    return this.findOneBy(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(id);
  }
}