import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, BadRequestException } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateStep1Dto } from './dto/create-step1.dto';
import { CreateStep2Dto } from './dto/create-step2.dto';
import { CreateStep3Dto } from './dto/create-step3.dto';

@Controller('auth/register')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    /**
     * STEP 1: Personal Information
     * POST /auth/register/step1
     */
    @Post('step1')
    @HttpCode(HttpStatus.OK)
    async registerStep1(@Body() createStep1Dto: CreateStep1Dto) {
        return this.registrationService.processStep1(createStep1Dto);
    }

    /**
     * STEP 2: Account Information (Email, Password, Country, Terms)
     * POST /auth/register/step2
     */
    @Post('step2')
    @HttpCode(HttpStatus.OK)
    async registerStep2(@Body() body: { sessionToken: string; data: CreateStep2Dto }) {
        const { sessionToken, data } = body;

        if (!sessionToken) {
            throw new BadRequestException('Session token is required');
        }

        return this.registrationService.processStep2(sessionToken, data);
    }

    /**
     * STEP 3: Finalize Registration (Femo ID, Femo Mail, Phone)
     * POST /auth/register/step3
     */
    @Post('step3')
    @HttpCode(HttpStatus.OK)
    async registerStep3(@Body() body: { sessionToken: string; data: CreateStep3Dto }) {
        const { sessionToken, data } = body;

        if (!sessionToken) {
            throw new BadRequestException('Session token is required');
        }

        return this.registrationService.processStep3(sessionToken, data);
    }

    /**
     * Get Femo Mail suggestions
     * GET /auth/register/femo-mail-suggestions?username=john
     */
    @Get('femo-mail-suggestions')
    @HttpCode(HttpStatus.OK)
    async getFemoMailSuggestions(@Query('username') username: string) {
        if (!username) {
            throw new BadRequestException('Username is required');
        }

        return {
            suggestions: await this.registrationService.getFemoMailSuggestions(username),
        };
    }

    /**
     * Validate Femo Mail availability
     * GET /auth/register/validate-femo-mail?femoMailName=john
     */
    @Get('validate-femo-mail')
    @HttpCode(HttpStatus.OK)
    async validateFemoMail(@Query('femoMailName') femoMailName: string) {
        if (!femoMailName) {
            throw new BadRequestException('Femo mail name is required');
        }

        return this.registrationService.validateFemoMailAvailability(femoMailName);
    }

    /**
     * Validate email availability
     * GET /auth/register/validate-email?email=user@example.com
     */
    @Get('validate-email')
    @HttpCode(HttpStatus.OK)
    async validateEmail(@Query('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email is required');
        }

        return this.registrationService.validateEmailAvailability(email);
    }

    /**
     * Check password strength
     * POST /auth/register/check-password-strength
     */
    @Post('check-password-strength')
    @HttpCode(HttpStatus.OK)
    async checkPasswordStrength(@Body('password') password: string) {
        if (!password) {
            throw new BadRequestException('Password is required');
        }

        return this.registrationService.getPasswordStrength(password);
    }
}
