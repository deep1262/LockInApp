import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');
const faah = new Sound('faah.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) console.log('Failed to load sound', error);
});

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
  const [showRelapse, setShowRelapse] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, [])
  );

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

  const confirmRelapse = async () => {
    faah.play();
    const current = await AsyncStorage.getItem('relapses');
    const count = current ? parseInt(current) + 1 : 1;
    await AsyncStorage.setItem('relapses', String(count));
    await AsyncStorage.setItem('startDate', new Date().toISOString());
    setStreakDays(0);
    setShowRelapse(false);
    setShowReset(true);
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

      <TouchableOpacity style={s.relapseBtn} onPress={() => setShowRelapse(true)}>
        <Text style={s.relapseBtnText}>I RELAPSED</Text>
      </TouchableOpacity>

      {/* Relapse Confirmation Modal */}
      <Modal transparent animationType="fade" visible={showRelapse}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalIconBox}>
              <Text style={s.modalIcon}>⚠️</Text>
            </View>
            <Text style={s.modalTitle}>ARE YOU SURE?</Text>
            <Text style={s.modalSubtitle}>You are about to reset</Text>
            <Text style={s.modalDays}>{streakDays} DAYS</Text>
            <Text style={s.modalSubtitle}>This cannot be undone.</Text>
            <View style={s.modalDivider} />
            <TouchableOpacity
              style={s.modalCancelBtn}
              onPress={() => setShowRelapse(false)}>
              <Text style={s.modalCancelText}>NO — STAY STRONG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.modalConfirmBtn}
              onPress={confirmRelapse}>
              <Text style={s.modalConfirmText}>YES, I RELAPSED</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal transparent animationType="fade" visible={showReset}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalIcon}>💀</Text>
            <Text style={s.modalTitle}>STREAK RESET</Text>
            <Text style={s.modalBody}>
              Your streak has been reset to 0.{'\n\n'}
              Get back up. Lock in again.{'\n'}
              Every champion has fallen.{'\n'}
              The difference is they got back up.
            </Text>
            <View style={s.modalDivider} />
            <TouchableOpacity
              style={s.modalCancelBtn}
              onPress={() => setShowReset(false)}>
              <Text style={s.modalCancelText}>I'M GETTING BACK UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Modal styles
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 30},
  modal: {backgroundColor: '#111', borderRadius: 16, padding: 28, width: '100%', borderWidth: 1, borderColor: '#2a0000', alignItems: 'center'},
  modalIconBox: {marginBottom: 12},
  modalIcon: {fontSize: 40, textAlign: 'center', marginBottom: 12},
  modalTitle: {color: '#ff3333', fontSize: 22, fontWeight: '900', letterSpacing: 4, marginBottom: 12, textAlign: 'center'},
  modalSubtitle: {color: '#555', fontSize: 13, textAlign: 'center'},
  modalDays: {color: '#fff', fontSize: 52, fontWeight: '900', marginVertical: 8},
  modalBody: {color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 24, marginVertical: 8},
  modalDivider: {height: 1, backgroundColor: '#222', width: '100%', marginVertical: 20},
  modalCancelBtn: {backgroundColor: '#ff3333', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10},
  modalCancelText: {color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 2},
  modalConfirmBtn: {backgroundColor: 'transparent', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#333'},
  modalConfirmText: {color: '#555', fontWeight: '700', fontSize: 13, letterSpacing: 2},
});