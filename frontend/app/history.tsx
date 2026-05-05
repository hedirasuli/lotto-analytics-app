import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { translations } from '../src/locals';
import { globalStyles, theme } from '../src/styles';

export default function HistoryScreen() {
  /* State for language and data */
  const [lang, setLang] = useState<'de' | 'en'>('de');
  const t = translations[lang];
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  /* Fetch history from backend */
  const fetchHistory = async () => {
    // Only show full-screen loader if not refreshing via pull-down
    if (!refreshing) setLoading(true);
    
    try {
      const response = await axios.get('http://192.168.178.23:8000/history');
      setHistoryData(response.data.data);
    } catch (err) {
      console.error("History Fetch Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the pull-down spinner
    }
  };

  /* Pull-to-Refresh handler */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  useEffect(() => { fetchHistory(); }, []);
