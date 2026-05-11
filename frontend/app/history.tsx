import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { useLanguage } from '../src/context/LanguageContext'; // Import the hook to access language context
import { globalStyles, theme } from '../src/styles';
import { API_ENDPOINTS } from '../src/config';

export default function HistoryScreen() {
  /* State for language and data */
  const [lang, setLang] = useState<'de' | 'en'>('de');
  const { language, setLanguage, t } = useLanguage(); // Use the hook to get translations and language state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  /* Fetch history from backend */
  const fetchHistory = async () => {
    // Only show full-screen loader if not refreshing via pull-down
    if (!refreshing) setLoading(true);
    
    try {
      const response = await axios.get(API_ENDPOINTS.HISTORY);
      setHistoryData(response.data.data);
    } catch (err: any) {
      if (__DEV__) {
        
      console.error("History Fetch Error:", err);
    }
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

  // Show big spinner only during initial load
  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#00CED1' }}>
      
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
        // --- Pull to Refresh Integration ---
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        
        {/* 1. Language Toggle Button */}
        <TouchableOpacity 
          // Use setLanguage from context instead of setLang
          onPress={() => setLanguage(language === 'de' ? 'en' : 'de')}
        
          style={{ 
            alignSelf: 'flex-start', 
            backgroundColor: '#e8f5e9', 
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 15,
            marginBottom: 20, 
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4
          }}
        >
          <Text style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: 16 }}>
          {language === 'de' ? '🇩🇪 DE' : '🇺🇸 EN'}
          </Text>
        </TouchableOpacity>

        {/* 2. Centered Page Title (Modified: Bilingual & Fixed) */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ 
            fontSize: 36, 
            fontWeight: '900', 
            color: 'white', 
            textAlign: 'center', 
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 5
          }}>
            {t.historyTitle}
          </Text>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            color: 'rgba(255, 255, 255, 0.8)', 
            textAlign: 'center',
            marginTop: -5
          }}>
            {t.historySubtitle}
          </Text>
        </View>

        {/* 3. History Cards List */}
        {historyData.map((item, index) => (
          <View key={index} style={[globalStyles.glassCard, { 
            width: '98%',
            marginBottom: 20, 
            padding: 18, 
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            alignItems: 'center',
            alignSelf: 'center'
          }]}>
            
            {/* Card Header: Lotto 6 aus 49 and Date (Restored) */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%',
              marginBottom: 15, 
              paddingBottom: 10,
              borderBottomWidth: 1, 
              borderBottomColor: '#eee' 
            }}>
              <View>
                <Text style={{ fontWeight: 'bold', color: theme.colors.primary, fontSize: 16 }}>
                  Lotto 6 aus 49
                </Text>
                <Text style={{ color: '#888', fontSize: 12 }}>
                  {item.game_type?.toUpperCase() || "LOTTO"}
                </Text>
              </View>
              <Text style={{ color: '#666', fontSize: 14 }}>
                {new Date(item.draw_date).toLocaleDateString()}
              </Text>
            </View>

            {/* Lottery Numbers Container */}
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {/* Primary Numbers circles */}
              {item.primary_numbers.map((num: number, i: number) => (
                <View key={i} style={{ 
                  width: 38,
                  height: 38, 
                  borderRadius: 19, 
                  backgroundColor: '#f0f0f0', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginHorizontal: 5,
                  marginBottom: 10,
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>{num}</Text>
                </View>
              ))}
              
              {/* Superzahl (Bonus Ball) */}
              <View style={{ 
                width: 42, 
                height: 42, 
                borderRadius: 21, 
                backgroundColor: theme.colors.superzahl, 
                justifyContent: 'center', 
                alignItems: 'center', 
                marginBottom: 10,
                borderWidth: 2, 
                borderColor: '#fff',
                elevation: 5, 
              }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff' }}>
                  {item.bonus_numbers[0]}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}