import userRepository from '../repositories/userRepository';
import { CreateUserDto, User } from '../models/user';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  async register(userData: CreateUserDto): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmailPublic(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = await userRepository.create(userData);
    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(loginData: LoginDto): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(loginData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    return userRepository.findById(userId);
  }
}

export default new AuthService();
