import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { Book, Calendar, LogOut, Sparkles, Target, Zap, Lock } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import GikiLogo from '../../assets/GIKIlogo.png'

export default function HomeScreen({ navigation }: any) {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image source={GikiLogo} style={styles.image} />
          {/* Header with Welcome Message */}
          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Welcome back</Text>
                <Text style={styles.title}>Smart Attendance</Text>
              </View>
              <View style={styles.badge}>
                <Sparkles size={18} color="#ffffff" strokeWidth={2} />
              </View>
            </View>
            <Text style={styles.subtitle}>AI-Powered attendance management at your fingertips</Text>
          </View>      

          {/* Main Navigation Cards */}
          <View style={styles.navigationSection}>
            <Text style={styles.sectionTitle}>Your Courses & Sessions</Text>
            
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => navigation.navigate('Courses')}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <Book size={28} color="#7c3aed" strokeWidth={2} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Courses</Text>
                <Text style={styles.cardDescription}>Manage and view all your courses</Text>
              </View>
              <View style={styles.cardArrow}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sessionCard}
              onPress={() => navigation.navigate('Sessions')}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <Calendar size={28} color="#06b6d4" strokeWidth={2} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Sessions</Text>
                <Text style={styles.cardDescription}>View attendance records</Text>
              </View>
              <View style={styles.cardArrow}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <View style={[styles.featureBadge, { backgroundColor: '#f3e8ff' }]}>
                  <Target size={28} color="#7c3aed" strokeWidth={2} />
                </View>
                <Text style={styles.featureText}>Accurate Recognition</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureBadge, { backgroundColor: '#ecfdf5' }]}>
                  <Zap size={28} color="#10b981" strokeWidth={2} />
                </View>
                <Text style={styles.featureText}>Lightning Fast</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureBadge, { backgroundColor: '#cffafe' }]}>
                  <Lock size={28} color="#06b6d4" strokeWidth={2} />
                </View>
                <Text style={styles.featureText}>Secure & Private</Text>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <LogOut size={18} color="#6b7280" strokeWidth={2} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerSection: {
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7c3aed',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  navigationSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ede9fe',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#cffafe',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardArrow: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 20,
    color: '#d1d5db',
    fontWeight: '300',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureEmoji: {
    fontSize: 28,
  },  featureText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  image: {
    width: 80,
    height: 80,
    marginHorizontal: 'auto',
  }
});