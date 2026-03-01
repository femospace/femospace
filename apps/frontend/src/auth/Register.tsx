import React, { useState, useCallback } from 'react';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import styles from './Register.module.css';

export interface Step1Data {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other' | 'Prefer not to say';
}

export interface Step2Data {
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface Step3Data {
  femoMailName: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
}

interface RegistrationState {
  step1Data: Step1Data | null;
  step2Data: Step2Data | null;
  sessionToken: string | null;
}

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [registrationState, setRegistrationState] = useState<RegistrationState>({
    step1Data: null,
    step2Data: null,
    sessionToken: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const handleStep1Submit = useCallback(async (data: Step1Data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/step1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Step 1 failed');
      }

      const result = await response.json();
      setRegistrationState((prev) => ({
        ...prev,
        step1Data: data,
        sessionToken: result.sessionToken,
      }));
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const handleStep2Submit = useCallback(async (data: Step2Data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/step2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: registrationState.sessionToken,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Step 2 failed');
      }

      const result = await response.json();
      setRegistrationState((prev) => ({
        ...prev,
        step2Data: data,
        sessionToken: result.sessionToken,
      }));
      setCurrentStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, registrationState.sessionToken]);

  const handleStep3Submit = useCallback(async (data: Step3Data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/step3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: registrationState.sessionToken,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      // Registration successful - redirect to login or profile
      window.location.href = '/login?registered=true';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, registrationState.sessionToken]);

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
      setError(null);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1>Join Femo Space</h1>
          <p className={styles.stepIndicator}>Step {currentStep} of 3</p>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.formContainer}>
          {currentStep === 1 && (
            <Step1
              onSubmit={handleStep1Submit}
              loading={loading}
              initialData={registrationState.step1Data}
            />
          )}

          {currentStep === 2 && (
            <Step2
              onSubmit={handleStep2Submit}
              onPrevious={handlePrevStep}
              loading={loading}
              initialData={registrationState.step2Data}
            />
          )}

          {currentStep === 3 && (
            <Step3
              onSubmit={handleStep3Submit}
              onPrevious={handlePrevStep}
              loading={loading}
              initialData={registrationState.step3Data}
            />
          )}
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account? <a href="/login">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
