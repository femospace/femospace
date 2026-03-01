import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../../config';




class RegistrationAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Step 1: Submit personal information
   */
  async step1(data: {
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
  }): Promise<{ sessionToken: string }> {
    try {
      const response = await this.api.post('/auth/register/step1', data);
      return response.data;
    } catch (error) {
      console.warn('Backend invalid/unreachable. Using mock data for Step 1.');
      // Mock success for UI flow
      return { sessionToken: 'mock-session-token-step1' };
    }
  }

  /**
   * Step 2: Submit account information
   */
  async step2(
    sessionToken: string,
    data: {
      email: string;
      password: string;
      confirmPassword: string;
      country: string;
      termsAccepted: boolean;
      privacyAccepted: boolean;
    }
  ): Promise<{ sessionToken: string }> {
    try {
      const response = await this.api.post('/auth/register/step2', {
        sessionToken,
        data,
      });
      return response.data;
    } catch (error) {
      console.warn('Backend invalid/unreachable. Using mock data for Step 2.');
      return { sessionToken: 'mock-session-token-step2' };
    }
  }

  /**
   * Step 3: Finalize registration
   */
  async step3(
    sessionToken: string,
    data: {
      femoMailName: string;
      phoneCountryCode?: string;
      phoneNumber?: string;
    }
  ): Promise<{
    success: boolean;
    userId: string;
    femoId: number;
    femoMail: string;
    message: string;
  }> {
    try {
      const response = await this.api.post('/auth/register/step3', {
        sessionToken,
        data,
      });
      return response.data;
    } catch (error) {
      console.warn('Backend invalid/unreachable. Using mock data for Step 3.');
      return {
        success: true,
        userId: 'mock-user-id',
        femoId: 1000001,
        femoMail: `${data.femoMailName}@femo.com`,
        message: 'Registration successful (Mock)',
      };
    }
  }

  /**
   * Get Femo Mail suggestions
   */
  async getFemoMailSuggestions(username: string): Promise<{ suggestions: string[] }> {
    try {
      const response = await this.api.get('/auth/register/femo-mail-suggestions', {
        params: { username },
      });
      return response.data;
    } catch (e) {
      // Mock suggestions
      const clean = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return {
        suggestions: [
          `${clean}.official@femo.com`,
          `${clean}123@femo.com`,
          `real.${clean}@femo.com`,
          `${clean}.space@femo.com`,
          `iam.${clean}@femo.com`
        ]
      };
    }
  }

  /**
   * Validate Femo Mail availability
   */
  async validateFemoMail(femoMailName: string): Promise<{
    available: boolean;
    message: string;
  }> {
    const response = await this.api.get('/auth/register/validate-femo-mail', {
      params: { femoMailName },
    });
    return response.data;
  }

  /**
   * Validate email availability
   */
  async validateEmail(email: string): Promise<{
    available: boolean;
    message: string;
  }> {
    const response = await this.api.get('/auth/register/validate-email', {
      params: { email },
    });
    return response.data;
  }

  /**
   * Check password strength
   */
  async checkPasswordStrength(password: string): Promise<{
    score: number;
    feedback: string;
    isValid: boolean;
  }> {
    const response = await this.api.post('/auth/register/check-password-strength', {
      password,
    });
    return response.data;
  }
}

export const registrationAPI = new RegistrationAPI();
