import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationProvider } from '../context/RegistrationContext';
import RegisterStep1 from '../steps/RegisterStep1';
import RegisterStep2 from '../steps/RegisterStep2';
import RegisterStep3 from '../steps/RegisterStep3';

const Register: React.FC = () => {
  return (
    <RegistrationProvider>
      <Routes>
        <Route path="step1" element={<RegisterStep1 />} />
        <Route path="step2" element={<RegisterStep2 />} />
        <Route path="step3" element={<RegisterStep3 />} />
        <Route path="/" element={<Navigate to="step1" replace />} />
      </Routes>
    </RegistrationProvider>
  );
};

export default Register;
