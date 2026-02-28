import React, {useState, useEffect} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Every day you resist, you become harder to break.",
  "Real men build themselves. Lock in.",
  "Your future self is watching. Don't disappoint him.",
  "The pain of discipline is nothing compared to the pain of regret.",
];

export default function HomeScreen() {
  const [streakDays, setStreakDays] = useState(0);
  const [goalDays, setGoalDays] = useState(90);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    loadData();
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const loadData = async () => {
    try {
      const startDate = await AsyncStorage.getItem('startDate');
      const goal = await AsyncStorage.getItem('goalDays');
      if (startDate) {
        const days = Math.floor(
          (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        setStreakDays(days);
      } else {
        await AsyncStorage.setItem('startDate', new Date().toISOString());
      }
      if (goal) setGoalDays(parseInt(goal));
    } catch (e) {}
  };

  const handleRelapse = () => {
    Alert.alert(
      'ARE YOU SURE?',
      `You will lose ${streakDays} days. This cannot be undone.`,
      [
        {text: 'No, Stay Strong', style: 'cancel'},
        {
          text: 'Yes, I Relapsed',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.setItem('startDate', new Date().toISOString());
            setStreakDays(0);
          },
        },
      ],
    );
  };

  const daysLeft = Math.max(goalDays - streakDays, 0);
  const progress = Math.min((streakDays / goalDays) * 100, 100);

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>LOCK IN</Text>

      <View style={s.streakBox}>
        <Text style={s.streakNumber}>{streakDays}</Text>
        <Text style={s.streakLabel}>DAYS CLEAN</Text>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, {width: `${progress}%`}]} />
      </View>
      <Text style={s.progressText}>{daysLeft} days left to reach {goalDays} day goal</Text>

      <View style={s.milestones}>
        {[7, 14, 30, 90, 180, 365].map(m => (
          <View key={m} style={[s.badge, streakDays >= m && s.badgeActive]}>
            <Text style={s.badgeText}>{m}d</Text>
          </View>
        ))}
      </View>

      <View style={s.quoteBox}>
        <Text style={s.quoteText}>"{quote}"</Text>
      </View>

      <TouchableOpacity style={s.relapseBtn} onPress={handleRelapse}>
        <Text style={s.relapseBtnText}>I RELAPSED</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0a0a0a', padding: 20},
  title: {color: '#ff3333', fontSize: 32, fontWeight: '900', textAlign: 'center', letterSpacing: 8, marginTop: 20},
  streakBox: {alignItems: 'center', marginVertical: 40},
  streakNumber: {color: '#fff', fontSize: 120, fontWeight: '900', lineHeight: 120},
  streakLabel: {color: '#ff3333', fontSize: 18, fontWeight: '700', letterSpacing: 6},
  progressBar: {height: 6, backgroundColor: '#222', borderRadius: 3, marginVertical: 10},
  progressFill: {height: 6, backgroundColor: '#ff3333', borderRadius: 3},
  progressText: {color: '#555', fontSize: 13, textAlign: 'center', marginBottom: 20},
  milestones: {flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30},
  badge: {padding: 8, borderRadius: 8, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333'},
  badgeActive: {backgroundColor: '#ff3333', borderColor: '#ff3333'},
  badgeText: {color: '#fff', fontSize: 12, fontWeight: '700'},
  quoteBox: {backgroundColor: '#111', padding: 20, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#ff3333', marginBottom: 30},
  quoteText: {color: '#aaa', fontSize: 14, fontStyle: 'italic', lineHeight: 22},
  relapseBtn: {backgroundColor: '#1a0000', borderWidth: 1, borderColor: '#ff3333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 40},
  relapseBtnText: {color: '#ff3333', fontSize: 14, fontWeight: '700', letterSpacing: 3},
});
