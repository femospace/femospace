import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Step1Data {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
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

export interface RegistrationContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  step1Data: Step1Data | null;
  setStep1Data: (data: Step1Data) => void;
  step2Data: Step2Data | null;
  setStep2Data: (data: Step2Data) => void;
  step3Data: Step3Data | null;
  setStep3Data: (data: Step3Data) => void;
  femoId: number | null;
  setFemoId: (id: number | null) => void;
  femoMail: string | null;
  setFemoMail: (mail: string | null) => void;
  reset: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
  const [femoId, setFemoId] = useState<number | null>(null);
  const [femoMail, setFemoMail] = useState<string | null>(null);

  const reset = () => {
    setCurrentStep(1);
    setSessionToken(null);
    setStep1Data(null);
    setStep2Data(null);
    setStep3Data(null);
    setFemoId(null);
    setFemoMail(null);
  };

  const value: RegistrationContextType = {
    currentStep,
    setCurrentStep,
    sessionToken,
    setSessionToken,
    step1Data,
    setStep1Data,
    step2Data,
    setStep2Data,
    step3Data,
    setStep3Data,
    femoId,
    setFemoId,
    femoMail,
    setFemoMail,
    reset,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return context;
};
