import React from 'react';
import {useEffect} from 'react';
import {scheduleDailyNotification} from './android/app/src/main/utils/notifications';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './android/app/src/main/screens/HomeScreen';
import GoalScreen from './android/app/src/main/screens/GoalScreen';
import TodoScreen from './android/app/src/main/screens/TodoScreen';
import EmergencyScreen from './android/app/src/main/screens/EmergencyScreen';
import StatsScreen from './android/app/src/main/screens/StatsScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({label, color}: {label: string; color: string}) => (
  <Text style={{fontSize: 20, color}}>{label}</Text>
);

export default function App() {
  useEffect(() => {
    scheduleDailyNotification();
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: '#0a0a0a', borderTopColor: '#222'},
          tabBarActiveTintColor: '#ff3333',
          tabBarInactiveTintColor: '#555',
          headerStyle: {backgroundColor: '#0a0a0a'},
          headerTintColor: '#fff',
        }}>
        <Tab.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Streak',
            tabBarIcon: ({color}) => <TabIcon label="🔥" color={color} />,
          }}
        />
        <Tab.Screen
          name="GOAL"
          component={GoalScreen}
          options={{
            tabBarLabel: 'Goal',
            tabBarIcon: ({color}) => <TabIcon label="🎯" color={color} />,
          }}
        />
        <Tab.Screen
          name="TODO"
          component={TodoScreen}
          options={{
            tabBarLabel: 'Tasks',
            tabBarIcon: ({color}) => <TabIcon label="✅" color={color} />,
          }}
        />
        <Tab.Screen
          name="SOS"
          component={EmergencyScreen}
          options={{
            tabBarLabel: 'SOS',
            tabBarIcon: ({color}) => <TabIcon label="🆘" color={color} />,
          }}
        />
        <Tab.Screen
          name="STATS"
          component={StatsScreen}
          options={{
            tabBarLabel: 'Stats',
            tabBarIcon: ({color}) => <TabIcon label="📊" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center'},
  text: {color: '#fff', fontSize: 24, fontWeight: 'bold'},
});