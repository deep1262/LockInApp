import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({onFinish}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Fade in logo + scale
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Step 2: Fade in subtitle after logo appears
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      // Step 3: Fade in footer
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }).start();
    });

    // Step 4: Finish after 3 seconds
    const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => onFinish());
      }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={s.container}>
      <Animated.View
        style={[s.content, {opacity, transform: [{scale}]}]}>
        <Text style={s.icon}>🔒</Text>
        <Text style={s.title}>LOCK IN</Text>
      </Animated.View>

      <Animated.Text style={[s.subtitle, {opacity: subtitleOpacity}]}>
        DISCIPLINE IS FREEDOM
      </Animated.Text>

      <Animated.Text style={[s.footer, {opacity: footerOpacity}]}>
        Stay focused. Stay clean.
      </Animated.Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    color: '#ff3333',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 12,
  },
  subtitle: {
    color: '#444',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 6,
    marginTop: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    color: '#333',
    fontSize: 12,
    letterSpacing: 3,
  },
});