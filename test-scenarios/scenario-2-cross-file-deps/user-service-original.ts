import { UserData } from './types';

export class UserService {
  private users: UserData[] = [];

  getUser(id: number): UserData | null { // ORIGINAL: no async
    return this.users.find(u => u.id === id) || null;
  }

  validateUser(user: UserData): boolean {
    return user.id > 0 && user.name.length > 0;
  }

  createUser(userData: Partial<UserData>): UserData {
    const newUser: UserData = {
      id: Date.now(),
      name: userData.name || '',
      email: userData.email || '',
      preferences: userData.preferences || {
        theme: 'light',
        notifications: true,
        language: 'en',
        timezone: 'UTC',
        emailFrequency: 'weekly'
      }
    };
    this.users.push(newUser);
    return newUser;
  }
}