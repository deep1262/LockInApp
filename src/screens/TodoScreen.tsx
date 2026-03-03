import React, {useState, useEffect} from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES = ['Work', 'Health', 'Self-improvement', 'Other'];

type Task = {
  id: string;
  title: string;
  category: string;
  done: boolean;
  date: string;
};

export default function TodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Work');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem('tasks');
    if (saved) {
      const parsed: Task[] = JSON.parse(saved);
      const today = new Date().toDateString();
      const filtered = parsed.filter(t => t.date === today || !t.done);
      setTasks(filtered);
    }
  };

  const saveTasks = async (updated: Task[]) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    setTasks(updated);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      category,
      done: false,
      date: new Date().toDateString(),
    };
    saveTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  };

  const deleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Remove this task?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () =>
        saveTasks(tasks.filter(t => t.id !== id))},
    ]);
  };

  const done = tasks.filter(t => t.done).length;

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>DAILY TASKS</Text>
      <Text style={s.score}>{done}/{tasks.length} completed today</Text>

      <View style={s.progressBar}>
        <View style={[s.progressFill, {width: tasks.length ? `${(done/tasks.length)*100}%` : '0%'}]} />
      </View>

      <Text style={s.label}>NEW TASK</Text>
      <TextInput
        style={s.input}
        value={newTask}
        onChangeText={setNewTask}
        placeholder="What needs to be done?"
        placeholderTextColor="#444"
        onSubmitEditing={addTask}
      />

      <View style={s.cats}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[s.cat, category === c && s.catActive]}
            onPress={() => setCategory(c)}>
            <Text style={[s.catText, category === c && s.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.addBtn} onPress={addTask}>
        <Text style={s.addBtnText}>+ ADD TASK</Text>
      </TouchableOpacity>

      <Text style={s.label}>TASKS</Text>
      {tasks.length === 0 && (
        <Text style={s.empty}>No tasks yet. Add one above.</Text>
      )}
      {tasks.map(task => (
        <TouchableOpacity
          key={task.id}
          style={[s.task, task.done && s.taskDone]}
          onPress={() => toggleTask(task.id)}
          onLongPress={() => deleteTask(task.id)}>
          <View style={[s.checkbox, task.done && s.checkboxDone]}>
            {task.done && <Text style={s.checkmark}>✓</Text>}
          </View>
          <View style={s.taskInfo}>
            <Text style={[s.taskTitle, task.done && s.taskTitleDone]}>{task.title}</Text>
            <Text style={s.taskCat}>{task.category}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={s.hint}>Long press a task to delete it</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0a0a0a', padding: 20},
  title: {color: '#ff3333', fontSize: 28, fontWeight: '900', letterSpacing: 6, marginTop: 20},
  score: {color: '#fff', fontSize: 16, marginTop: 6, marginBottom: 10},
  progressBar: {height: 4, backgroundColor: '#222', borderRadius: 2, marginBottom: 24},
  progressFill: {height: 4, backgroundColor: '#ff3333', borderRadius: 2},
  label: {color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 3, marginBottom: 10, marginTop: 20},
  input: {backgroundColor: '#111', borderWidth: 1, borderColor: '#333', borderRadius: 8, color: '#fff', padding: 14, fontSize: 16},
  cats: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12},
  cat: {paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333'},
  catActive: {backgroundColor: '#ff3333', borderColor: '#ff3333'},
  catText: {color: '#555', fontSize: 12, fontWeight: '600'},
  catTextActive: {color: '#fff'},
  addBtn: {backgroundColor: '#111', borderWidth: 1, borderColor: '#ff3333', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16},
  addBtnText: {color: '#ff3333', fontWeight: '700', letterSpacing: 2},
  task: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#222'},
  taskDone: {opacity: 0.4},
  checkbox: {width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: '#ff3333', alignItems: 'center', justifyContent: 'center', marginRight: 12},
  checkboxDone: {backgroundColor: '#ff3333'},
  checkmark: {color: '#fff', fontSize: 13, fontWeight: '900'},
  taskInfo: {flex: 1},
  taskTitle: {color: '#fff', fontSize: 15, fontWeight: '600'},
  taskTitleDone: {textDecorationLine: 'line-through', color: '#555'},
  taskCat: {color: '#444', fontSize: 11, marginTop: 2},
  empty: {color: '#333', fontSize: 14, textAlign: 'center', marginTop: 30},
  hint: {color: '#333', fontSize: 11, textAlign: 'center', marginTop: 16, marginBottom: 40},
});