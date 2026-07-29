import React, { useState, useCallback, useEffect } from 'react';
import { Step3Data } from '../Register';
import styles from '../Register.module.css';
import { COUNTRIES } from '../constants/countries';

interface Step3Props {
  onSubmit: (data: Step3Data) => Promise<void>;
  onPrevious: () => void;
  loading: boolean;
  initialData?: Step3Data;
}

interface FemoMailSuggestion {
  suggestion: string;
  available: boolean;
}

const Step3: React.FC<Step3Props> = ({ onSubmit, onPrevious, loading, initialData }) => {
  const [formData, setFormData] = useState<Step3Data>(
    initialData || {
      femoMailName: '',
      phoneCountryCode: '',
      phoneNumber: '',
    }
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<FemoMailSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'https://femospace.onrender.com';

  const fetchSuggestions = useCallback(async (username: string) => {
    if (username.length < 3) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register/femo-mail-suggestions?username=${encodeURIComponent(username)}`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  }, [API_BASE_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);

    if (name === 'femoMailName') {
      if (value.length >= 3) {
        fetchSuggestions(value);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setFormData((prev) => ({
      ...prev,
      femoMailName: suggestion,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.femoMailName.trim()) {
      setValidationError('Femo Mail username is required');
      return;
    }
    if (formData.femoMailName.length < 3) {
      setValidationError('Femo Mail username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(formData.femoMailName)) {
      setValidationError('Femo Mail username can only contain letters, numbers, underscore, dot, and hyphen');
      return;
    }

    // Phone validation if provided
    if (formData.phoneNumber) {
      if (!formData.phoneCountryCode) {
        setValidationError('Country code is required when providing phone number');
        return;
      }
      if (!/^\d+$/.test(formData.phoneNumber)) {
        setValidationError('Phone number must contain only digits');
        return;
      }
    }

    await onSubmit(formData);
  };

  return (
    <div className={styles.step}>
      <h2>Finalize Your Account</h2>

      {validationError && <div className={styles.errorMessage}>{validationError}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="femoMailName">Femo Mail Username *</label>
        <div className={styles.femoMailInput}>
          <input
            type="text"
            id="femoMailName"
            name="femoMailName"
            value={formData.femoMailName}
            onChange={handleChange}
            placeholder="yourname"
            disabled={loading}
            required
          />
          <span className={styles.femoMailDomain}>@femo.com</span>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsBox}>
            <p className={styles.suggestionsLabel}>Available alternatives:</p>
            <div className={styles.suggestionsList}>
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(item.suggestion)}
                  className={styles.suggestionButton}
                  disabled={!item.available}
                >
                  {item.suggestion}@femo.com {!item.available && '(taken)'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className={styles.optionalSection}>Phone Number (Optional)</h3>

      <div className={styles.phoneGroup}>
        <div className={styles.formGroup}>
          <label htmlFor="phoneCountryCode">Country Code</label>
          <select
            id="phoneCountryCode"
            name="phoneCountryCode"
            value={formData.phoneCountryCode || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select country code</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            placeholder="1234567890"
            disabled={loading || !formData.phoneCountryCode}
          />
        </div>
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
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </div>

      <div className={styles.successMessage}>
        <p>🎉 You're almost there! Complete your registration to join Femo Space.</p>
      </div>
    </div>
  );
};

export default Step3;
