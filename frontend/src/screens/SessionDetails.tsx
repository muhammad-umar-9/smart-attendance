import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';
import { API_BASE_URL } from '../config';

export default function SessionDetails({ route }: any) {
  const { sessionId, courseId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);

  const resolveSnapshotUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const fetchRecords = useCallback(async () => {
    if (!sessionId) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await client.get(`/attendance/records`, { params: { session_id: sessionId } });
      setRecords(res.data || []);
    } catch (err) {
      Alert.alert('Error', 'Unable to load records.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleUpload = useCallback(async () => {
    if (!sessionId || !courseId) {
      Alert.alert('Missing context', 'Course and session info are required to attach a snapshot.');
      return;
    }
    try {
      setUploading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to capture attendance images.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.7 });
      if (result.canceled || !result.assets?.length) {
        return;
      }
      const asset = result.assets[0];
      const formData = new FormData();
      formData.append('course_id', String(courseId));
      formData.append('session_id', String(sessionId));
      formData.append('notes', 'Manual snapshot');
      formData.append('image_file', {
        uri: asset.uri,
        name: asset.fileName ?? `snapshot-${Date.now()}.jpg`,
        type: asset.mimeType ?? 'image/jpeg',
      } as any);

      await client.post('/attendance/mark-face', formData);

      await fetchRecords();
    } catch (err) {
      Alert.alert('Upload failed', 'Could not upload the snapshot. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [courseId, sessionId, fetchRecords]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Records</Text>
      <View style={styles.actions}>
        <Button
          title={uploading ? 'Uploading…' : 'Capture Snapshot'}
          onPress={handleUpload}
          disabled={uploading || !courseId}
        />
      </View>
      <FlatList
        data={records}
        keyExtractor={(r) => String(r.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>Student ID: {item.student_id ?? 'Unidentified'}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            {item.confidence && <Text style={styles.meta}>Confidence: {item.confidence}</Text>}
            {item.snapshot_url && (
              <Image source={{ uri: resolveSnapshotUrl(item.snapshot_url) ?? undefined }} style={styles.snapshot} />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontWeight: '700', fontSize: 18, marginBottom: 12 },
  actions: { marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontWeight: '600' },
  status: { color: '#666', marginTop: 4 },
  meta: { color: '#666', marginTop: 4 },
  snapshot: { marginTop: 10, width: '100%', height: 180, borderRadius: 6 },
});
