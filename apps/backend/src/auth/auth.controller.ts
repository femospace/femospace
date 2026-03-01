import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginIdentifierDto } from './dto/login-identifier.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async signup(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(createUserDto);

        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: result.access_token, user: result.user };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Req() req: any, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(dto, {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            deviceId: req.headers['x-device-id'] || 'web-default',
        });

        if ('mfaRequired' in result) {
            return result;
        }

        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: result.access_token, user: result.user };
    }

    /**
     * NEW ENDPOINT: Login with Femo ID or Femo Mail
     * POST /auth/login/identifier
     * 
     * Request body:
     * {
     *   "identifier": "1000021",  // femoId OR femoMail
     *   "password": "User@1234"
     * }
     */
    @Post('login/identifier')
    @HttpCode(HttpStatus.OK)
    async loginWithIdentifier(
        @Body() dto: LoginIdentifierDto,
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.loginWithIdentifier(dto, {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            deviceId: req.headers['x-device-id'] || 'web-default',
        });

        if ('mfaRequired' in result) {
            return result;
        }

        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: result.access_token, user: result.user };
    }

    @Post('login/mfa')
    @HttpCode(HttpStatus.OK)
    async loginMfa(
        @Body('userId') userId: string,
        @Body('token') token: string,
        @Req() req: any,
        @Res({ passthrough: true }) res: Response
    ) {
        const tokens = await this.authService.loginMfa(userId, token, {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            deviceId: req.headers['x-device-id'] || 'web-default',
        });

        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: tokens.access_token, user: tokens.user };
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const userId = req.user['sub'];
        await this.authService.logout(userId);
        res.clearCookie('refresh_token');
        return { message: 'Logged out' };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) throw new ForbiddenException('No Refresh Token');

        const tokens = await this.authService.refreshTokens(refreshToken);

        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: tokens.access_token };
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body('email') email: string) {
        await this.authService.forgotPassword(email);
        return { message: 'If an account exists with this email, a reset link has been sent.' };
    }
}
