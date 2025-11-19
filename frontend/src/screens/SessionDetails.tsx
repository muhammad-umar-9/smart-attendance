import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import client from '../api/client';

export default function SessionDetails({ route }: any) {
  const { sessionId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/attendance/records`, { params: { session_id: sessionId } });
        setRecords(res.data || []);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Records</Text>
      <FlatList
        data={records}
        keyExtractor={(r) => String(r.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.student_name}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontWeight: '700', fontSize: 18, marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontWeight: '600' },
  status: { color: '#666' },
});
