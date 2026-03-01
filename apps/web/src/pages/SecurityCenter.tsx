import React, { useState, useEffect } from 'react';
import styles from './SecurityCenter.module.css';
import {
    Shield, Lock, Watch, Globe, Eye,
    Trash2, Key, Bell, ShieldCheck, Fingerprint
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { MfaSetupModal } from '../components/security/MfaSetupModal';
import { format } from 'date-fns';

interface Session {
    id: string;
    deviceId: string;
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
    lastActiveAt: string;
    isActive: boolean;
}

export const SecurityCenter: React.FC = () => {
    const { user, updateUserProfile } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [trustScore, setTrustScore] = useState(98);

    useEffect(() => {
        fetchSessions();
        fetchRiskAssessment();
        fetchLogs();
    }, []);

    const fetchSessions = async () => {
        try {
            const { data } = await api.get('/security/sessions');
            setSessions(data);
        } catch (err) {
            console.error('Failed to fetch sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const { data } = await api.get('/audit/logs');
            setLogs(data);
        } catch (err) {
            console.error('Failed to fetch logs');
        }
    };

    const fetchRiskAssessment = async () => {
        try {
            const { data } = await api.get('/security/risk-assessment');
            // trustScore = 100 - riskScore
            setTrustScore(100 - data.score);
        } catch (err) {
            console.error('Failed to fetch risk assessment');
        }
    };

    const handleRevoke = async (deviceId: string) => {
        try {
            await api.delete(`/security/sessions/${deviceId}`);
            setSessions(sessions.filter(s => s.deviceId !== deviceId));
        } catch (err) {
            console.error('Failed to revoke session');
        }
    };

    const handleLogoutAll = async () => {
        if (!confirm('Are you sure you want to logout from all other devices?')) return;
        try {
            await api.delete('/security/sessions');
            fetchSessions();
        } catch (err) {
            console.error('Failed to logout from all devices');
        }
    };

    return (
        <div className={styles.securityContainer}>
            <h1 className={styles.title}>Security & Privacy Center</h1>
            <p className={styles.subtitle}>Manage your digital identity, sessions, and data protection settings.</p>

            <div className={styles.grid}>
                {/* MFA Card */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <ShieldCheck className={styles.icon} />
                        Two-Factor Authentication
                    </div>
                    <p className={styles.cardDesc}>
                        {user?.mfaEnabled
                            ? 'Your account is protected by two-factor authentication. An extra code is required for login.'
                            : 'Add an extra layer of security to your account. We\'ll ask for a code whenever you log in from a new device.'
                        }
                    </p>
                    <button
                        onClick={() => setIsMfaModalOpen(true)}
                        className={`${styles.actionBtn} ${user?.mfaEnabled ? styles.secondaryBtn : styles.primaryBtn}`}
                    >
                        <Fingerprint size={18} /> {user?.mfaEnabled ? 'Manage MFA' : 'Setup MFA'}
                    </button>
                </div>

                {/* Active Sessions Card */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <Watch className={styles.icon} />
                        Active Sessions
                    </div>
                    <div className={styles.sessionList}>
                        {isLoading ? (
                            <p className="text-gray-500 text-sm">Loading sessions...</p>
                        ) : sessions.length === 0 ? (
                            <p className="text-gray-500 text-sm">No active sessions found.</p>
                        ) : sessions.map(session => (
                            <div key={session.deviceId} className={styles.sessionItem}>
                                <div className={styles.sessionInfo}>
                                    <h4>
                                        {session.deviceName || 'Unknown Device'}
                                        {session.isActive && <span className={styles.statusBadge}>Current</span>}
                                    </h4>
                                    <p>{session.ipAddress} • {format(new Date(session.lastActiveAt), 'MMM d, HH:mm')}</p>
                                </div>
                                {!session.isActive && (
                                    <button className={styles.revokeBtn} onClick={() => handleRevoke(session.deviceId)}>Revoke</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleLogoutAll}
                        className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                        style={{ marginTop: '16px' }}
                    >
                        Logout From All Other Devices
                    </button>
                </div>

                {/* Password Card */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <Lock className={styles.icon} />
                        Password & Keys
                    </div>
                    <p className={styles.cardDesc}>
                        We recommend changing your password regularly for maximum security.
                    </p>
                    <button className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        <Key size={18} /> Change Password
                    </button>
                </div>

                {/* Data Privacy Card */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <Eye className={styles.icon} />
                        Data & Privacy
                    </div>
                    <p className={styles.cardDesc}>
                        Download your data or request account deletion. You can also manage which apps have access to your profile.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                            <Globe size={18} /> Export Data
                        </button>
                        <button className={`${styles.actionBtn} ${styles.secondaryBtn}`} style={{ color: '#ef4444' }}>
                            <Trash2 size={18} /> Delete Account
                        </button>
                    </div>
                </div>

                {/* Activity Alerts */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <Bell className={styles.icon} />
                        Security Alerts
                    </div>
                    <p className={styles.cardDesc}>
                        Get notified of suspicious logins, password changes, and new device authorizations via email or push.
                    </p>
                    <button className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        Configure Alerts
                    </button>
                </div>

                {/* Account Activity Card */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <Watch className={styles.icon} />
                        Account Activity
                    </div>
                    <div className={styles.sessionList}>
                        {logs.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent activity.</p>
                        ) : logs.slice(0, 5).map(log => (
                            <div key={log._id} className={styles.sessionItem}>
                                <div className={styles.sessionInfo}>
                                    <h4>{log.action.replace(/_/g, ' ')}</h4>
                                    <p>{log.status} • {format(new Date(log.createdAt), 'MMM d, HH:mm')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Score Card */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <Shield className={styles.icon} />
                        AI Trust Score
                    </div>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        margin: '20px 0',
                        color: trustScore > 80 ? '#10b981' : trustScore > 50 ? '#f59e0b' : '#ef4444'
                    }}>
                        {trustScore}/100
                    </div>
                    <p className={styles.cardDesc}>
                        Your account is {trustScore > 80 ? 'highly trusted' : 'at potential risk'}. This score helps us protect you from impersonation and fraud.
                    </p>
                </div>
            </div>

            <MfaSetupModal
                isOpen={isMfaModalOpen}
                onClose={() => setIsMfaModalOpen(false)}
                onSuccess={() => {
                    updateUserProfile({ mfaEnabled: true });
                }}
            />
        </div>
    );
};
