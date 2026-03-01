import React from 'react';
import { LegalPage } from './LegalPage';

export const TermsPage: React.FC = () => React.createElement(LegalPage, { type: 'terms' });
export const PrivacyPage: React.FC = () => React.createElement(LegalPage, { type: 'privacy' });
export const HelpCenter: React.FC = () => React.createElement(LegalPage, { type: 'help' });
