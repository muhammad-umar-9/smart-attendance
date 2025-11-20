import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Check, X, Clock } from 'lucide-react-native';
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'present') return '#10b981';
    if (statusLower === 'absent') return '#ef4444';
    if (statusLower === 'late') return '#f59e0b';
    return '#6b7280';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'present') return <Check size={18} color="#10b981" strokeWidth={2.5} />;
    if (statusLower === 'absent') return <X size={18} color="#ef4444" strokeWidth={2.5} />;
    if (statusLower === 'late') return <Clock size={18} color="#f59e0b" strokeWidth={2.5} />;
    return null;
  };

  const presentCount = records.filter(r => r.status.toLowerCase() === 'present').length;
  const absentCount = records.filter(r => r.status.toLowerCase() === 'absent').length;
  const lateCount = records.filter(r => r.status.toLowerCase() === 'late').length;

  return (
    <View style={styles.container}>
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

      <FlatList
        data={records}
        keyExtractor={(r) => String(r.id)}
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <View style={styles.recordLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
                {getStatusIcon(item.status)}
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.name}>{item.student_name}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 16,
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
  listContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 20,
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
});