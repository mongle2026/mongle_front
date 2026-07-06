import { useEffect, useRef, useState } from 'react';
import { View, Modal, Animated, PanResponder, Pressable, StyleSheet } from 'react-native';

import { colors, shadow } from '../styles/color';
import { padding, radius } from '../styles/token';

const SHEET_HEIGHT = 720;
const CLOSE_THRESHOLD = 80;

export default function BottomSheet({ children, visible = false, onClose, style }) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SHEET_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setModalVisible(false));
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose?.());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
          opacityAnim.setValue(1 - gestureState.dy / SHEET_HEIGHT);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > CLOSE_THRESHOLD) {
          handleClose();
        } else {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }, style]}>
          <Pressable style={styles.content}>
            <View style={styles.dragHandleArea} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
            </View>
            {children}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bgDim,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    height: SHEET_HEIGHT,
    paddingVertical: padding.S,
    borderTopLeftRadius: radius.M,
    borderTopRightRadius: radius.M,
    backgroundColor: colors.bgLayerDefault,
    overflow: 'hidden',
    ...shadow.middleUp,
  },
  dragHandleArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.M,
  },
  dragHandle: {
    width: 80,
    height: 4,
    borderRadius: radius.M,
    backgroundColor: colors.fgNeutralWeak,
  },
});
