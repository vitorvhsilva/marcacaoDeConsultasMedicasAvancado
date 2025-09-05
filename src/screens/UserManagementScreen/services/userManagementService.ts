import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/user';

export class UserServiceManagement {
  private storageKey = '@MedicalApp:users';

  async getUsers(excludeUserId?: string): Promise<User[]> {
    const stored = await AsyncStorage.getItem(this.storageKey);
    if (!stored) return [];
    const users: User[] = JSON.parse(stored);
    return excludeUserId ? users.filter(u => u.id !== excludeUserId) : users;
  }

  async addUser(user: User) {
    const users = await this.getUsers();
    users.push(user);
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  async updateUser(updatedUser: User) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index >= 0) {
      users[index] = updatedUser;
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(users));
    }
  }

  async deleteUser(userId: string) {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}

export const userServiceManagement = new UserServiceManagement();