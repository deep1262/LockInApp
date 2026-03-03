import React, {useState, useEffect, useRef} from 'react';
import {Animated} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {scheduleDailyNotification} from './src/utils/notifications';
import HomeScreen from './src/screens/HomeScreen';
import GoalScreen from './src/screens/GoalScreen';
import TodoScreen from './src/screens/TodoScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import StatsScreen from './src/screens/StatsScreen';
import SplashScreen from './src/components/SplashScreen';


const Tab = createBottomTabNavigator();

const TabIcon = ({label, color}: {label: string; color: string}) => (
  <Text style={{fontSize: 20, color}}>{label}</Text>
);

function MainApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: '#0a0a0a'}}
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

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const appOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scheduleDailyNotification();
  }, []);

  const handleSplashFinish = () => {
    setSplashDone(true);
  };

  useEffect(() => {
    if (splashDone) {
      Animated.timing(appOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [splashDone]);

  return (
    <View style={{flex: 1, backgroundColor: '#0a0a0a'}}>
      {splashDone && (
        <Animated.View style={{flex: 1, opacity: appOpacity, backgroundColor: '#0a0a0a'}}>
          <MainApp />
        </Animated.View>
      )}
      {!splashDone && (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
          <SplashScreen onFinish={handleSplashFinish} />
        </View>
      )}
    </View>
  );
}


const s = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center'},
  text: {color: '#fff', fontSize: 24, fontWeight: 'bold'},
});