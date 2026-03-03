import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatsScreen() {
  const [streakDays, setStreakDays] = useState(0);
  const [goalDays, setGoalDays] = useState(90);
  const [relapses, setRelapses] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [calendarDays, setCalendarDays] = useState<{date: string; clean: boolean}[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const startDate = await AsyncStorage.getItem('startDate');
    const goal = await AsyncStorage.getItem('goalDays');
    const rel = await AsyncStorage.getItem('relapses');
    const longest = await AsyncStorage.getItem('longestStreak');

    if (goal) setGoalDays(parseInt(goal));
    if (rel) setRelapses(parseInt(rel));

    if (startDate) {
      const days = Math.floor(
        (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      setStreakDays(days);

      const ls = longest ? Math.max(parseInt(longest), days) : days;
      setLongestStreak(ls);
      await AsyncStorage.setItem('longestStreak', String(ls));

      // Build last 30 days calendar
      const cal = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        cal.push({
          date: d.toDateString(),
          clean: i < days,
        });
      }
      setCalendarDays(cal);
    }
  };

  const totalClean = streakDays;
  const pct = goalDays > 0 ? Math.min(Math.round((streakDays / goalDays) * 100), 100) : 0;

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>YOUR STATS</Text>

      <View style={s.grid}>
        <View style={s.card}>
          <Text style={s.cardNum}>{streakDays}</Text>
          <Text style={s.cardLabel}>CURRENT{'\n'}STREAK</Text>
        </View>
        <View style={s.card}>
          <Text style={s.cardNum}>{longestStreak}</Text>
          <Text style={s.cardLabel}>LONGEST{'\n'}STREAK</Text>
        </View>
        <View style={s.card}>
          <Text style={s.cardNum}>{totalClean}</Text>
          <Text style={s.cardLabel}>TOTAL{'\n'}CLEAN DAYS</Text>
        </View>
        <View style={s.card}>
          <Text style={s.cardNum}>{relapses}</Text>
          <Text style={s.cardLabel}>TOTAL{'\n'}RELAPSES</Text>
        </View>
      </View>

      <View style={s.progressSection}>
        <Text style={s.sectionLabel}>GOAL PROGRESS — {pct}%</Text>
        <View style={s.progressBar}>
          <View style={[s.progressFill, {width: `${pct}%`}]} />
        </View>
        <Text style={s.progressText}>{streakDays} of {goalDays} days</Text>
      </View>

      <Text style={s.sectionLabel}>LAST 30 DAYS</Text>
      <View style={s.calendar}>
        {calendarDays.map((day, i) => (
          <View
            key={i}
            style={[s.calDay, day.clean ? s.calClean : s.calDirty]}>
            <Text style={s.calDayText}>{new Date(day.date).getDate()}</Text>
          </View>
        ))}
      </View>
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, {backgroundColor: '#ff3333'}]} />
          <Text style={s.legendText}>Clean</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, {backgroundColor: '#222'}]} />
          <Text style={s.legendText}>Before streak</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0a0a0a', padding: 20},
  title: {color: '#ff3333', fontSize: 28, fontWeight: '900', letterSpacing: 6, marginTop: 20, marginBottom: 24},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24},
  card: {flex: 1, minWidth: '45%', backgroundColor: '#111', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#222', alignItems: 'center'},
  cardNum: {color: '#ff3333', fontSize: 48, fontWeight: '900'},
  cardLabel: {color: '#555', fontSize: 11, fontWeight: '700', letterSpacing: 2, textAlign: 'center', marginTop: 4},
  progressSection: {backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#222'},
  sectionLabel: {color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 3, marginBottom: 12},
  progressBar: {height: 8, backgroundColor: '#222', borderRadius: 4, marginBottom: 8},
  progressFill: {height: 8, backgroundColor: '#ff3333', borderRadius: 4},
  progressText: {color: '#555', fontSize: 12},
  calendar: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16},
  calDay: {width: 36, height: 36, borderRadius: 6, alignItems: 'center', justifyContent: 'center'},
  calClean: {backgroundColor: '#ff3333'},
  calDirty: {backgroundColor: '#1a1a1a'},
  calDayText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  legend: {flexDirection: 'row', gap: 20, marginBottom: 40},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
  legendDot: {width: 12, height: 12, borderRadius: 3},
  legendText: {color: '#555', fontSize: 12},
});