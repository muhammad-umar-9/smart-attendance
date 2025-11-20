import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar, FileText, ChevronRight } from 'lucide-react-native';
import client from '../api/client';

export default function SessionsScreen() {
  const navigation = useNavigation<any>();
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sessions</Text>
        <Text style={styles.headerSubtitle}>{sessions.length} sessions</Text>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate(
                'SessionDetails' as never,
                { sessionId: item.id, courseId: item.course_id } as never,
              )
            }
          >
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                  <Calendar size={16} color="#2563eb" strokeWidth={2} />
                  <Text style={styles.date}>{formatDate(item.session_date)}</Text>
                </View>
                <ChevronRight size={20} color="#2563eb" strokeWidth={2} />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardContent}>
                <View style={styles.courseIdBadge}>
                  <Text style={styles.courseIdLabel}>Course ID</Text>
                  <Text style={styles.courseId}>{item.course_id}</Text>
                </View>

                {item.notes && (
                  <View style={styles.notesContainer}>
                    <FileText size={14} color="#6b7280" strokeWidth={2} />
                    <Text style={styles.notes}>{item.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
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
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  courseIdBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  courseIdLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  courseId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginTop: 2,
  },
  notesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  notes: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
});