import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Camera, Book, Calendar } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Smart Attendance</Text>
          <Text style={styles.subtitle}>AI-Powered Student Recognition</Text>
        </View>

        {/* Main Action - Camera Button */}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Camera size={48} color="#ffffff" strokeWidth={1.5} />
          <Text style={styles.cameraButtonText}>Take Attendance Photo</Text>
          <Text style={styles.cameraButtonSubtext}>Scan students instantly</Text>
        </TouchableOpacity>

        {/* Secondary Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Courses')}
          >
            <Book size={32} color="#374151" strokeWidth={1.5} />
            <Text style={styles.actionTitle}>Courses</Text>
            <Text style={styles.actionSubtext}>Manage your courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Sessions')}
          >
            <Calendar size={32} color="#374151" strokeWidth={1.5} />
            <Text style={styles.actionTitle}>Sessions</Text>
            <Text style={styles.actionSubtext}>View all sessions</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  cameraButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    marginTop: 12,
  },
  cameraButtonSubtext: {
    fontSize: 13,
    color: '#dbeafe',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
    marginTop: 8,
  },
  actionSubtext: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});