import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image, ImageBackground } from 'react-native';
import { Book, Calendar, LogOut } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import GikiLogo from '../../assets/GIKIlogo.png'

export default function HomeScreen({ navigation }: any) {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('../../assets/bg.png')} 
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Smart Attendance</Text>
          </View>

          {/* Logo */}
          <Image source={GikiLogo} style={styles.logo} />

          {/* Courses Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your Courses</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Courses')}
              activeOpacity={0.8}
            >
              <Book size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.buttonText}>View Courses</Text>
            </TouchableOpacity>
          </View>

          {/* Sessions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sessions</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Sessions')}
              activeOpacity={0.8}
            >
              <Calendar size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.buttonText}>View Sessions</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <LogOut size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ff9966',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a3a3a',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a3a3a',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a3a3a',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 'auto',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});