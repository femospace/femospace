import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { X, Mail, Phone, Copy, Check, MessageCircle, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface ContactModalProps {
    visible: boolean;
    onClose: () => void;
    navigation: any;
}

export const ContactModal: React.FC<ContactModalProps> = ({ visible, onClose, navigation }) => {
    const { t } = useTranslation();
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const contacts = [
        { type: 'chat', value: 'Start Live Chat', label: 'Instant Support', action: 'chat' },
        { type: 'community', value: 'Visit Community', label: 'Community Help', action: 'community' },
        { type: 'email', value: 'femospace@gmail.com', label: 'Support Email' },
        { type: 'email', value: 'femospace@femo.com', label: 'Official Email' },
        { type: 'email', value: 'sscorporate@femo.com', label: 'Corporate Email' },
        { type: 'email', value: 'sscorporate@gmail.com', label: 'Corporate Support' },
        { type: 'phone', value: '+12345678999', label: 'Support Phone' },
    ];

    const handleCopy = (text: string, index: number) => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('contact.title', 'Contact Us')}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X color="#94a3b8" size={20} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.description}>
                        {t('contact.description', 'Reach out to us via any of the following channels:')}
                    </Text>

                    <ScrollView style={styles.list}>
                        {contacts.map((contact, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.contactItem}
                                onPress={() => {
                                    if (contact.action) {
                                        if (contact.action === 'chat') {
                                            navigation.navigate('Login'); 
                                        } else if (contact.action === 'community') {
                                            navigation.navigate('Login'); 
                                        }
                                        onClose();
                                    } else {
                                        handleCopy(contact.value, index);
                                    }
                                }}
                            >
                                <View style={styles.iconContainer}>
                                    {contact.type === 'email' ? <Mail color="#60a5fa" size={18} /> :
                                     contact.type === 'phone' ? <Phone color="#60a5fa" size={18} /> :
                                     contact.type === 'chat' ? <MessageCircle color="#60a5fa" size={18} /> :
                                     <Users color="#60a5fa" size={18} />}
                                </View>

                                <View style={styles.textContainer}>
                                    <Text style={styles.label}>{contact.label}</Text>
                                    <Text style={styles.value} numberOfLines={1}>{contact.value}</Text>
                                </View>

                                {!contact.action && (
                                    <View style={styles.copyIcon}>
                                        {copiedIndex === index ? (
                                            <Check color="#34d399" size={18} />
                                        ) : (
                                            <Copy color="#94a3b8" size={18} />
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {t('contact.response_time', 'We typically respond within 24 hours.')}
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeBtn: {
        padding: 4,
    },
    description: {
        color: '#cbd5e1',
        fontSize: 14,
        padding: 20,
        paddingBottom: 10,
    },
    list: {
        paddingHorizontal: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(59,130,246,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500',
    },
    value: {
        color: '#fff',
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    copyIcon: {
        padding: 8,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        color: '#64748b',
        fontSize: 12,
    },
});
