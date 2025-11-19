import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './navigation';

export default function Root() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
