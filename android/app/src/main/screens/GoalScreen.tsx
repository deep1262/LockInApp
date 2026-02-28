import React, {useState, useEffect} from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoalScreen() {
  const [goalDays, setGoalDays] = useState('90');
  const [why, setWhy] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const g = await AsyncStorage.getItem('goalDays');
    const w = await AsyncStorage.getItem('whyStatement');
    if (g) setGoalDays(g);
    if (w) setWhy(w);
  };

  const saveData = async () => {
    if (!goalDays || parseInt(goalDays) < 1) {
      Alert.alert('Invalid', 'Enter a valid number of days.');
      return;
    }
    await AsyncStorage.setItem('goalDays', goalDays);
    await AsyncStorage.setItem('whyStatement', why);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>SET YOUR GOAL</Text>
      <Text style={s.subtitle}>Define what you're fighting for.</Text>

      <Text style={s.label}>GOAL DURATION (DAYS)</Text>
      <TextInput
        style={s.input}
        value={goalDays}
        onChangeText={setGoalDays}
        keyboardType="numeric"
        placeholderTextColor="#444"
        placeholder="e.g. 90"
      />

      <View style={s.presets}>
        {[7, 30, 90, 180, 365].map(d => (
          <TouchableOpacity
            key={d}
            style={[s.preset, goalDays === String(d) && s.presetActive]}
            onPress={() => setGoalDays(String(d))}>
            <Text style={s.presetText}>{d}d</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>WHY ARE YOU DOING THIS?</Text>
      <TextInput
        style={[s.input, s.textArea]}
        value={why}
        onChangeText={setWhy}
        placeholder="Write your reason here. Be honest. Be specific."
        placeholderTextColor="#444"
        multiline
        numberOfLines={5}
      />
      <Text style={s.hint}>This will appear on your Emergency screen when you're struggling.</Text>

      <TouchableOpacity style={s.saveBtn} onPress={saveData}>
        <Text style={s.saveBtnText}>{saved ? '✅ SAVED' : 'SAVE GOAL'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0a0a0a', padding: 20},
  title: {color: '#ff3333', fontSize: 28, fontWeight: '900', letterSpacing: 6, marginTop: 20},
  subtitle: {color: '#555', fontSize: 14, marginBottom: 30, marginTop: 6},
  label: {color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 3, marginBottom: 10, marginTop: 20},
  input: {backgroundColor: '#111', borderWidth: 1, borderColor: '#333', borderRadius: 8, color: '#fff', padding: 14, fontSize: 16},
  textArea: {height: 130, textAlignVertical: 'top'},
  presets: {flexDirection: 'row', gap: 10, marginTop: 12},
  preset: {paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333'},
  presetActive: {backgroundColor: '#ff3333', borderColor: '#ff3333'},
  presetText: {color: '#fff', fontWeight: '700'},
  hint: {color: '#444', fontSize: 12, marginTop: 8, fontStyle: 'italic'},
  saveBtn: {backgroundColor: '#ff3333', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 40},
  saveBtnText: {color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 3},
});