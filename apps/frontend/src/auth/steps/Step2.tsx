import React, { useState, useCallback } from 'react';
import { Step2Data } from '../Register';
import styles from '../Register.module.css';

interface Step2Props {
  onSubmit: (data: Step2Data) => Promise<void>;
  onPrevious: () => void;
  loading: boolean;
  initialData: Step2Data | null;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  isValid: boolean;
}

const Step2: React.FC<Step2Props> = ({ onSubmit, onPrevious, loading, initialData }) => {
  const [formData, setFormData] = useState<Step2Data>(
    initialData || {
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      termsAccepted: false,
      privacyAccepted: false,
    }
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'https://femospace.onrender.com';

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setValidationError(null);

    // Check password strength if password field changes
    if (name === 'password' && value) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register/check-password-strength`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: value }),
        });

        if (response.ok) {
          const data = await response.json();
          setPasswordStrength(data);
        }
      } catch (err) {
        console.error('Error checking password strength:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }
    if (!formData.confirmPassword) {
      setValidationError('Please confirm your password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (passwordStrength && !passwordStrength.isValid) {
      setValidationError('Password does not meet security requirements');
      return;
    }
    if (!formData.country) {
      setValidationError('Please select a country');
      return;
    }
    if (!formData.termsAccepted || !formData.privacyAccepted) {
      setValidationError('You must accept Terms & Conditions and Privacy Policy');
      return;
    }

    await onSubmit(formData);
  };

  const strengthColor = passwordStrength ? {
    0: '#d32f2f',
    1: '#f57c00',
    2: '#fbc02d',
    3: '#7cb342',
    4: '#388e3c',
    5: '#1976d2',
  }[passwordStrength.score] : 'transparent';

  return (
    <div className={styles.step}>
      <h2>Account Setup</h2>

      {validationError && <div className={styles.errorMessage}>{validationError}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          disabled={loading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password (8+ chars, uppercase, lowercase, number, special) *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={loading}
          required
        />
        {passwordStrength && (
          <div className={styles.strengthIndicator}>
            <div
              className={styles.strengthBar}
              style={{
                width: `${(passwordStrength.score + 1) * 20}%`,
                backgroundColor: strengthColor,
              }}
            />
            <span className={styles.strengthText}>{passwordStrength.feedback}</span>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={loading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="country">Country/Region *</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">Select your country</option>
          {/* Countries will be populated from API */}
        </select>
      </div>

      <div className={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            disabled={loading}
            required
          />
          I accept the <a href="/legal/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
        </label>
      </div>

      <div className={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={handleChange}
            disabled={loading}
            required
          />
          I accept the <a href="/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onPrevious}
          disabled={loading}
          className={styles.secondaryButton}
        >
          Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Processing...' : 'Next: Finalize'}
        </button>
      </div>
    </div>
  );
};

export default Step2;
