import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, FlipHorizontal, Flashlight, Circle, Type, Music, Settings, Image as ImageIcon } from 'lucide-react-native';
import { theme } from '../theme';

export const CameraScreen = ({ navigation }: any) => {
    const [facing, setFacing] = useState<'front' | 'back'>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>FemoSpace needs camera access for Live Studio & Stories.</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelBtnText}>Not Now</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <SafeAreaView style={styles.safeArea}>
                    
                    {/* Top Controls */}
                    <View style={styles.topControls}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                            <X color="#fff" size={28} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.soundButton}>
                            <Music color="#fff" size={16} />
                            <Text style={styles.soundText}>Add Sound</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton}>
                            <Settings color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Right Side Tools */}
                    <View style={styles.rightTools}>
                        <TouchableOpacity style={styles.toolBtn} onPress={toggleCameraFacing}>
                            <FlipHorizontal color="#fff" size={28} />
                            <Text style={styles.toolText}>Flip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolBtn}>
                            <Flashlight color="#fff" size={28} />
                            <Text style={styles.toolText}>Flash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolBtn}>
                            <Type color="#fff" size={28} />
                            <Text style={styles.toolText}>Text</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.bottomControls}>
                        {/* Gallery */}
                        <TouchableOpacity style={styles.galleryBtn}>
                            <ImageIcon color="#fff" size={28} />
                            <Text style={styles.toolText}>Upload</Text>
                        </TouchableOpacity>

                        {/* Capture Button */}
                        <View style={styles.captureOuter}>
                            <TouchableOpacity style={styles.captureInner} />
                        </View>

                        {/* Effects Placeholder */}
                        <TouchableOpacity style={styles.effectsBtn}>
                            <Circle color="#fff" size={28} />
                            <Text style={styles.toolText}>Effects</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Mode Selector */}
                    <View style={styles.modeSelector}>
                        <Text style={styles.modeText}>Post</Text>
                        <Text style={[styles.modeText, styles.modeTextActive]}>Story</Text>
                        <Text style={styles.modeText}>Reels</Text>
                        <Text style={styles.modeText}>Live</Text>
                    </View>

                </SafeAreaView>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: theme.spacing.xl,
    },
    permissionText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: theme.spacing.lg,
    },
    permissionBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        marginBottom: theme.spacing.md,
    },
    permissionBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelBtn: {},
    cancelBtnText: {
        color: theme.colors.textMuted,
    },
    camera: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    iconButton: {
        padding: 8,
    },
    soundButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    soundText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rightTools: {
        position: 'absolute',
        right: 20,
        top: 120,
        gap: 24,
    },
    toolBtn: {
        alignItems: 'center',
    },
    toolText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    galleryBtn: {
        alignItems: 'center',
    },
    effectsBtn: {
        alignItems: 'center',
    },
    captureOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.danger,
    },
    modeSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingTop: 10,
    },
    modeText: {
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 'bold',
        fontSize: 14,
    },
    modeTextActive: {
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
});
