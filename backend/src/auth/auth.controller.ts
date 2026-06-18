import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ================= REGISTER =================
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);

    this.setCookies(res, result.accessToken, result.refreshToken);

    return {
      message: 'Account created successfully',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  // ================= LOGIN =================
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    this.setCookies(res, result.accessToken, result.refreshToken);

    return {
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  // ================= REFRESH TOKEN =================
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      req.cookies?.refresh_token ||
      req.body?.refreshToken ||
      req.headers['x-refresh-token'];

    if (!refreshToken) {
      return { message: 'No refresh token found' };
    }

    const tokens = await this.authService.refreshTokens(refreshToken as string);

    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Token refreshed',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // ================= LOGOUT =================
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProd =
      process.env.NODE_ENV === 'production' ||
      process.env.FRONTEND_URL?.startsWith('https://');

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/api/auth',
    });

    return {
      message: 'Logged out successfully',
    };
  }

  // ================= GET CURRENT USER =================
  @Get('me')
  @ApiBearerAuth()
  async me(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  // ================= COOKIE HANDLER =================
  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProd =
      process.env.NODE_ENV === 'production' ||
      process.env.FRONTEND_URL?.startsWith('https://');

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,          // MUST be true on Railway
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}