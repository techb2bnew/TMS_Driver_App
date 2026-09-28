import React, { useState } from 'react';
import { Image, Linking, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import CenterSheetModal from './CenterSheetModal';
import CustomButton from './CustomButton';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { accentColor, accentSoft, borderStrong, dangerColor, okColor, okSoft, textBody, textMuted } from '../constant/Color';
import { StatusUpdateSheetText } from '../constant/Constants';

type StatusUpdateSheetProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (podPhotoUri?: string) => Promise<void> | void;
  loadId: string;
  actionLabel: string;
  requiresPod: boolean;
};

export default function StatusUpdateSheet({
  visible,
  onClose,
  onConfirm,
  loadId,
  actionLabel,
  requiresPod,
}: StatusUpdateSheetProps) {
  const [podUri, setPodUri] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setPodUri(null);
    setCameraError('');
    setPermissionDenied(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  // Android needs the CAMERA permission requested explicitly before
  // launchCamera — without this, a first-run device can silently fail
  // (or show the system prompt too late) instead of asking properly.
  async function ensureCameraPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    const already = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (already) return true;
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: StatusUpdateSheetText.cameraPermissionTitle,
      message: StatusUpdateSheetText.cameraPermissionMessage,
      buttonPositive: StatusUpdateSheetText.cameraPermissionAllow,
    });
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function handleCapture() {
    setCameraError('');
    setPermissionDenied(false);

    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) {
      setCameraError(StatusUpdateSheetText.cameraPermissionDenied);
      setPermissionDenied(true);
      return;
    }

    const result = await launchCamera({ mediaType: 'photo', cameraType: 'back', saveToPhotos: false, quality: 0.7 });
    if (result.didCancel) return;

    if (result.errorCode === 'permission') {
      setCameraError(StatusUpdateSheetText.cameraPermissionDenied);
      setPermissionDenied(true);
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (result.errorCode || !uri) {
      setCameraError(StatusUpdateSheetText.cameraError);
      return;
    }
    setPodUri(uri);
  }

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm(podUri ?? undefined);
    } finally {
      setSubmitting(false);
      reset();
    }
  }

  return (
    <CenterSheetModal visible={visible} onClose={handleClose} title={actionLabel}>
      <Text style={[style.fontSizeNormal1x, styles.message]}>
        {requiresPod
          ? StatusUpdateSheetText.addProofOfDeliveryMessage(loadId)
          : StatusUpdateSheetText.markAsMessage(loadId, actionLabel.toLowerCase())}
      </Text>

      {requiresPod && (
        <>
          {podUri ? (
            <View style={styles.podPreviewWrap}>
              <Image source={{ uri: podUri }} style={styles.podPreviewImage} resizeMode="cover" />
              <View style={styles.podCapturedBadge}>
                <Icon name="check-circle" size={16} color={okColor} />
                <Text style={[style.fontSizeSmall, style.fontWeightThin1x, styles.podCapturedBadgeText]}>
                  {StatusUpdateSheetText.proofOfDeliveryAdded}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={handleCapture} style={styles.retakeButton}>
                <Icon name="camera-retake-outline" size={16} color={accentColor} />
                <Text style={[style.fontSizeSmall, style.fontWeightThin1x, styles.retakeButtonText]}>
                  {StatusUpdateSheetText.retake}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.8} onPress={handleCapture} style={styles.podBox}>
              <Icon name="camera-plus-outline" size={30} color={accentColor} />
              <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.podText]}>
                {StatusUpdateSheetText.tapToCapture}
              </Text>
            </TouchableOpacity>
          )}
          {cameraError ? <Text style={[style.fontSizeSmall, styles.errorText]}>{cameraError}</Text> : null}
          {permissionDenied && (
            <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.settingsLink}>
              <Text style={[style.fontSizeSmall2x, style.fontWeightMedium, { color: accentColor }]}>
                {StatusUpdateSheetText.openSettings}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <View style={[BaseStyle.flexDirectionRow, styles.actions]}>
        <CustomButton label={StatusUpdateSheetText.cancelLabel} onPress={handleClose} variant="outline" fullWidth={false} style={styles.cancelButton} />
        <CustomButton
          label={actionLabel}
          onPress={handleConfirm}
          loading={submitting}
          disabled={requiresPod && !podUri}
          fullWidth={false}
          style={BaseStyle.flex}
        />
      </View>
    </CenterSheetModal>
  );
}

const styles = StyleSheet.create({
  message: {
    color: textBody,
    marginBottom: spacings.large,
  },
  podBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: borderStrong,
    borderRadius: 14,
    paddingVertical: spacings.xxLarge,
    alignItems: 'center',
    marginBottom: spacings.large,
  },
  podText: {
    color: textMuted,
    marginTop: spacings.small,
  },
  podPreviewWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: spacings.large,
  },
  podPreviewImage: {
    width: '100%',
    height: 160,
    backgroundColor: accentSoft,
  },
  podCapturedBadge: {
    position: 'absolute',
    left: spacings.normalx,
    bottom: spacings.normalx,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: okSoft,
    borderRadius: 20,
    paddingVertical: spacings.xxsmall,
    paddingHorizontal: spacings.normalx,
  },
  podCapturedBadgeText: {
    color: okColor,
    marginLeft: spacings.xxsmall,
  },
  retakeButton: {
    position: 'absolute',
    right: spacings.normalx,
    top: spacings.normalx,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: spacings.xxsmall,
    paddingHorizontal: spacings.normalx,
  },
  retakeButtonText: {
    color: accentColor,
    marginLeft: spacings.xxsmall,
  },
  errorText: {
    color: dangerColor,
    marginBottom: spacings.small,
  },
  settingsLink: {
    marginBottom: spacings.large,
  },
  actions: {
    gap: spacings.normalx,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: accentSoft,
    borderWidth: 0,
  },
});
