import React, {useState, useEffect, useRef} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMERGENCY_QUOTES = [
  "You've come too far to only come this far.",
  "The urge will pass in 10 minutes. Wait it out.",
  "Every time you resist, you rewire your brain.",
  "Don't trade your progress for a moment of weakness.",
  "Future you is begging present you to stop.",
];

export default function EmergencyScreen() {
  const [why, setWhy] = useState('');
  const [streakDays, setStreakDays] = useState(0);
  const [timer, setTimer] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const [quote] = useState(EMERGENCY_QUOTES[Math.floor(Math.random() * EMERGENCY_QUOTES.length)]);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1.05, duration: 800, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 1, duration: 800, useNativeDriver: true}),
      ])
    ).start();
  }, []);

  useEffect(() => {
    let interval: any;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const loadData = async () => {
    const w = await AsyncStorage.getItem('whyStatement');
    const startDate = await AsyncStorage.getItem('startDate');
    if (w) setWhy(w);
    if (startDate) {
      const days = Math.floor(
        (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      setStreakDays(days);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={s.container}>
      <Animated.Text style={[s.sos, {transform: [{scale: pulse}]}]}>
        🆘 HOLD THE LINE
      </Animated.Text>

      <View style={s.streakWarning}>
        <Text style={s.warningLabel}>YOU WILL LOSE</Text>
        <Text style={s.warningDays}>{streakDays}</Text>
        <Text style={s.warningLabel}>DAYS IF YOU QUIT NOW</Text>
      </View>

      {why ? (
        <View style={s.whyBox}>
          <Text style={s.whyLabel}>WHY YOU STARTED</Text>
          <Text style={s.whyText}>{why}</Text>
        </View>
      ) : (
        <View style={s.whyBox}>
          <Text style={s.whyText}>Go to Goal tab and write your WHY — it will appear here.</Text>
        </View>
      )}

      <View style={s.quoteBox}>
        <Text style={s.quoteText}>"{quote}"</Text>
      </View>

      <View style={s.timerBox}>
        <Text style={s.timerLabel}>WAIT OUT THE URGE</Text>
        <Text style={s.timerCount}>{formatTime(timer)}</Text>
        <View style={s.timerBtns}>
          <TouchableOpacity
            style={s.timerBtn}
            onPress={() => setTimerActive(!timerActive)}>
            <Text style={s.timerBtnText}>{timerActive ? '⏸ PAUSE' : '▶ START 10 MIN'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.timerReset}
            onPress={() => {setTimer(600); setTimerActive(false);}}>
            <Text style={s.timerResetText}>RESET</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.actions}>
        <Text style={s.actionsLabel}>DO THIS INSTEAD</Text>
        {['Do 20 Push-Ups RIGHT NOW', 'Take a cold shower', 'Go for a walk outside', 'Call a friend', 'Drink a full glass of water'].map(a => (
          <View key={a} style={s.action}>
            <Text style={s.actionText}>→ {a}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0a0a0a', padding: 20},
  sos: {color: '#ff3333', fontSize: 26, fontWeight: '900', textAlign: 'center', letterSpacing: 4, marginTop: 20, marginBottom: 24},
  streakWarning: {backgroundColor: '#1a0000', borderWidth: 1, borderColor: '#ff3333', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20},
  warningLabel: {color: '#ff3333', fontSize: 12, fontWeight: '700', letterSpacing: 3},
  warningDays: {color: '#fff', fontSize: 72, fontWeight: '900', lineHeight: 80},
  whyBox: {backgroundColor: '#111', borderRadius: 12, padding: 20, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#ff3333'},
  whyLabel: {color: '#ff3333', fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 8},
  whyText: {color: '#ccc', fontSize: 15, lineHeight: 24, fontStyle: 'italic'},
  quoteBox: {backgroundColor: '#0d0d0d', borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#222'},
  quoteText: {color: '#888', fontSize: 14, fontStyle: 'italic', lineHeight: 22, textAlign: 'center'},
  timerBox: {backgroundColor: '#111', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20},
  timerLabel: {color: '#555', fontSize: 11, letterSpacing: 3, marginBottom: 8},
  timerCount: {color: '#fff', fontSize: 64, fontWeight: '900', marginBottom: 16},
  timerBtns: {flexDirection: 'row', gap: 10},
  timerBtn: {backgroundColor: '#ff3333', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8},
  timerBtnText: {color: '#fff', fontWeight: '700', fontSize: 13},
  timerReset: {backgroundColor: '#1a1a1a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#333'},
  timerResetText: {color: '#555', fontWeight: '700', fontSize: 13},
  actions: {backgroundColor: '#111', borderRadius: 12, padding: 20, marginBottom: 40},
  actionsLabel: {color: '#ff3333', fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 12},
  action: {paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a1a'},
  actionText: {color: '#ccc', fontSize: 14},
});