import React, { useState, useCallback } from 'react';
import { Step1Data } from '../Register';
import styles from '../Register.module.css';

interface Step1Props {
  onSubmit: (data: Step1Data) => Promise<void>;
  loading: boolean;
  initialData: Step1Data | null;
}

const Step1: React.FC<Step1Props> = ({ onSubmit, loading, initialData }) => {
  const [formData, setFormData] = useState<Step1Data>(
    initialData || {
      firstName: '',
      lastName: '',
      birthday: '',
      gender: 'Prefer not to say',
    }
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAge = (dateString: string): boolean => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim()) {
      setValidationError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setValidationError('Last name is required');
      return;
    }
    if (!formData.birthday) {
      setValidationError('Birthday is required');
      return;
    }
    if (!validateAge(formData.birthday)) {
      setValidationError('You must be at least 18 years old');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className={styles.step}>
      <h2>Personal Information</h2>

      {validationError && <div className={styles.errorMessage}>{validationError}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="firstName">First Name *</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          disabled={loading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="lastName">Last Name *</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
          disabled={loading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="birthday">Birthday (18+ required) *</label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          disabled={loading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className={styles.submitButton}
      >
        {loading ? 'Processing...' : 'Next: Account Setup'}
      </button>
    </div>
  );
};

export default Step1;
