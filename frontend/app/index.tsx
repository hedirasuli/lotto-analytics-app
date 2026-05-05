import React, { useState, useEffect, useCallback } from 'react';
import { 
  Text, View, ActivityIndicator, SafeAreaView, 
  TouchableOpacity, StatusBar, ScrollView, RefreshControl, StyleSheet 
} from 'react-native';
import Animated, { FadeInDown, BounceIn } from 'react-native-reanimated';
import axios from 'axios';
import { translations } from '../src/locals';
import { globalStyles, theme } from '../src/styles';

export default function App() {
  /* 1. STATE & LANGUAGE LOGIC */
  const [lang, setLang] = useState<'de' | 'en'>('de');
  const t = translations[lang]; 

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
