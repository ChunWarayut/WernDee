import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.authService.hashPassword(createUserDto.password);

    const { password, ...userData } = createUserDto;
    
    return this.prisma.user.create({
      data: {
        ...userData,
        password_hash: hashedPassword,
      },
      include: { nurse: true },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { nurse: true },
      select: {
        id: true,
        username: true,
        role: true,
        nurse: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { nurse: true },
      select: {
        id: true,
        username: true,
        role: true,
        nurse: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.password) {
      updateData.password_hash = await this.authService.hashPassword(updateUserDto.password);
      delete updateData.password;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { nurse: true },
      select: {
        id: true,
        username: true,
        role: true,
        nurse: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
      },
    });
  }
}