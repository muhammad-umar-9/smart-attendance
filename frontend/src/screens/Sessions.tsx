import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import client from '../api/client';

export default function SessionsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId } = (route.params || {}) as any;

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const params = courseId ? { course_id: courseId } : undefined;
        const res = await client.get('/attendance/sessions', { params });
        setSessions(res.data || []);
      } catch (err) {
        // ignore for now
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'SessionDetails' as never,
                  { sessionId: item.id, courseId: item.course_id } as never,
                )
              }
            >
              <View style={styles.item}>
                <Text style={styles.title}>Course ID: {item.course_id}</Text>
                <Text style={styles.meta}>Date: {item.session_date}</Text>
                <Text style={styles.meta}>Notes: {item.notes}</Text>
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
  title: { fontWeight: '700' },
  meta: { color: '#666', marginTop: 6 },
});
