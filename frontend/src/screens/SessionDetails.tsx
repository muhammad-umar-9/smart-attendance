import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  Button,
  SafeAreaView,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Check, X, Clock } from 'lucide-react-native';
import client from '../api/client';
import { API_BASE_URL } from '../config';
import * as ImagePicker from 'expo-image-picker';

export default function SessionDetails({ route }: any) {
  const { sessionId, courseId } = route.params || {};
  
  // ✅ ALL STATE HOOKS FIRST
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  console.log('📝 Route params:', { sessionId, courseId });

  // ✅ UTILITY FUNCTIONS
  const resolveSnapshotUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const normalizeStatus = (status?: string | null) => (status ? status.toLowerCase() : 'unknown');

  const formatStatusLabel = (status?: string | null) => {
    const normalized = normalizeStatus(status);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const getStatusColor = (status?: string | null) => {
    const statusLower = normalizeStatus(status);
    if (statusLower === 'present') return '#10b981';
    if (statusLower === 'absent') return '#ef4444';
    if (statusLower === 'late') return '#f59e0b';
    return '#6b7280';
  };

  const getStatusIcon = (status?: string | null) => {
    const statusLower = normalizeStatus(status);
    if (statusLower === 'present') return <Check size={18} color="#10b981" strokeWidth={2.5} />;
    if (statusLower === 'absent') return <X size={18} color="#ef4444" strokeWidth={2.5} />;
    if (statusLower === 'late') return <Clock size={18} color="#f59e0b" strokeWidth={2.5} />;
    return null;
  };

  // ✅ CALLBACKS
  const fetchRecords = useCallback(async () => {
    if (!sessionId) {
      console.log('❌ No sessionId provided');
      setRecords([]);
      setError('Missing session context. Please open this screen from the Sessions list.');
      setLoading(false);
      return;
    }
    console.log('🔍 Fetching records for sessionId:', sessionId);
    setLoading(true);
    setError(null);
    try {
      const res = await client.get(`/attendance/records`, { params: { session_id: sessionId } });
      console.log('✅ Records received:', res.data);
      console.log('📊 Records length:', res.data?.length);
      setRecords(res.data || []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Unable to load records. Please pull down to retry.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

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

  // ✅ EFFECTS
  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [fetchRecords]),
  );

  // ✅ COMPUTED VALUES
  const presentCount = records.filter(r => normalizeStatus(r.status) === 'present').length;
  const absentCount = records.filter(r => normalizeStatus(r.status) === 'absent').length;
  const lateCount = records.filter(r => normalizeStatus(r.status) === 'late').length;

  // ✅ CONDITIONAL RETURNS
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // ✅ MAIN RENDER
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.actions}>
          <Button
            title={uploading ? 'Uploading…' : 'Capture Snapshot'}
            onPress={handleUpload}
            disabled={uploading || !courseId}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance Records</Text>
          <Text style={styles.headerSubtitle}>{records.length} students</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
            <Text style={styles.statLabel}>Present</Text>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{presentCount}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
            <Text style={styles.statLabel}>Absent</Text>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>{absentCount}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
            <Text style={styles.statLabel}>Late</Text>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>{lateCount}</Text>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <FlatList
          data={records}
          keyExtractor={(r) => String(r.id)}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            !loading ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={styles.emptyText}>No attendance records yet.</Text>
                <Text style={{ color: '#9ca3af', marginTop: 8, fontSize: 12 }}>
                  Session ID: {sessionId}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.recordCard}>
              <View style={styles.recordLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
                  {getStatusIcon(item.status)}
                </View>
                <View style={styles.recordInfo}>
                  <Text style={styles.name}>{item.student_name || 'Unknown student'}</Text>
                  <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                    {formatStatusLabel(item.status)}
                  </Text>
                </View>
              </View>
              {item.snapshot_url ? (
                <Image source={{ uri: resolveSnapshotUrl(item.snapshot_url) || undefined }} style={styles.snapshot} />
              ) : (
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>
                    {formatStatusLabel(item.status)}
                  </Text>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 20 }}
          scrollEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderLeftWidth: 3,
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  recordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actions: { 
    marginBottom: 12, 
    paddingTop: 16, 
    paddingHorizontal: 24 
  },
  errorText: {
    color: '#ef4444',
    paddingHorizontal: 24,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
    fontWeight: '500',
  },
  snapshot: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginLeft: 12,
  },
});