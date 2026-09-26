import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { borderColor, cardBg, scrim, textDark, textFaint } from '../constant/Color';

type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function BottomSheetModal({ visible, onClose, title, children }: BottomSheetModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[BaseStyle.flex, styles.backdrop]} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.header]}>
          <Text style={[style.fontSizeMedium1x, style.fontWeightMedium, { color: textDark }]}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Icon name="close" size={22} color={textFaint} />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: scrim,
  },
  sheet: {
    backgroundColor: cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.xxLarge,
    paddingTop: spacings.small,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: borderColor,
    alignSelf: 'center',
    marginVertical: spacings.normalx,
  },
  header: {
    marginBottom: spacings.large,
  },
});
