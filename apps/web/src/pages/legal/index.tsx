import React from 'react';
import { LegalPage } from './LegalPage';

export const TermsPage: React.FC = () => <LegalPage type="terms" />;
export const PrivacyPage: React.FC = () => <LegalPage type="privacy" />;
export const HelpCenter: React.FC = () => <LegalPage type="help" />;
