import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CustomRequest } from 'src/auth/dto/req-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //내정보조회
  @Get('me')
  @UseGuards(AuthGuard())
  async getMe(@Req() req: CustomRequest): Promise<GetUserDto> {
    const userId = req.user.id;
    const user = await this.userService.findUserById(userId);

    if (!userId) {
      throw new BadRequestException('유효한 사용자 ID가 제공되지 않았습니다.');
    }
    return {
      status: 200,
      message: '내 정보 조회에 성공했습니다',
      data: user,
    };
  }

  //내정보수정
  @Patch('me')
  @UseGuards(AuthGuard())
  async updateMe(
    @Req() req: CustomRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const userId = req.user.id;

    if (!userId) {
      throw new BadRequestException('유효한 사용자 ID가 제공되지 않았습니다.');
    }

    const updatedUser = await this.userService.updateUser(
      userId,
      updateUserDto,
    );

    return {
      status: 200,
      message: '내 정보 수정에 성공했습니다',
      data: updatedUser,
    };
  }

  //s3 유저 이미지 업로드
  @Post('me/upload-images')
  @UseInterceptors(FileInterceptor('file')) //클라이언트에서 보내는 필드이름 'file'
  @UseGuards(AuthGuard())
  async uploadImage(
    @Req() req: CustomRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const imageUrl = await this.userService.uploadUserImage(userId, file);

    return {
      status: 200,
      message: '이미지업로드 성공!',
      data: {
        image_url: imageUrl,
      },
    };
  }
}
