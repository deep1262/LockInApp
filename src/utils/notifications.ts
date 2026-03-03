import notifee, {TriggerType, RepeatFrequency, AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function scheduleDailyNotification() {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'lockin',
    name: 'Lock In Reminders',
    importance: AndroidImportance.HIGH,
  });

  const startDate = await AsyncStorage.getItem('startDate');
  const goalDays = await AsyncStorage.getItem('goalDays');

  const streak = startDate
    ? Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const goal = goalDays ? parseInt(goalDays) : 90;
  const daysLeft = Math.max(goal - streak, 0);

  const trigger = new Date();
  trigger.setHours(7, 0, 0, 0);
  if (trigger.getTime() < Date.now()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  await notifee.cancelAllNotifications();

  await notifee.createTriggerNotification(
    {
      title: '🔒 LOCK IN',
      body: `Day ${streak}. ${daysLeft} days left. Don't quit now.`,
      android: {channelId, importance: AndroidImportance.HIGH},
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: trigger.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    },
  );
}