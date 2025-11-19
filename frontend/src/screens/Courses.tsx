import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import client from '../api/client';

export default function CoursesScreen() {
  const navigation = useNavigation();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/courses');
        setCourses(res.data || []);
      } catch (err) {
        // ignore for now
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Sessions' as never, { courseId: item.id } as never)}>
            <View style={styles.item}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>{item.program} • {item.section}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  code: { fontWeight: '700' },
  title: { marginTop: 4 },
  meta: { color: '#666', marginTop: 6 },
});
