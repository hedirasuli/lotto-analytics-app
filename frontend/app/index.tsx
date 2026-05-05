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

  /* 2. API FETCHING */
  const fetchData = async () => {
    if (!refreshing) setLoading(true);
    setError(null);
    
    // Ensure this IP matches your local computer's IP
    const url = 'http://192.168.178.23:8000/predict';
    
    try {
        const response = await axios.get(url);
        setData(response.data);
    } catch (err: any) {
        console.error("API Error:", err);
        setError(t.error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFD700' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* LANGUAGE SWITCHER */}
      <View style={styles.langWrapper}>
        <TouchableOpacity 
          onPress={() => setLang(lang === 'de' ? 'en' : 'de')}
          style={styles.langButton}
        >
          <Text style={styles.langText}>{lang === 'de' ? '🇩🇪 DE' : '🇺🇸 EN'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[globalStyles.mainContainer, { paddingBottom: 40 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.headerTitle}>{t.title}</Text>
          <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
        </Animated.View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : data && data.strategies ? (
          <View style={{ width: '100%' }}>
            <Text style={styles.drawsInfo}>
              {t.drawsLabel.replace('{count}', data.analyzed_draws.toString())}
            </Text>

            {/* STRATEGY LIST */}
            {data.strategies.map((strategy: any, idx: number) => {
              const title = t[`${strategy.id}Title` as keyof typeof t];
              const desc = t[`${strategy.id}Desc` as keyof typeof t];

              return (
                <Animated.View 
                  key={`strat-${idx}`}
                  entering={FadeInDown.delay(300 + idx * 200)} 
                  style={[globalStyles.glassCard, styles.strategyCard]}
                >
                  <Text style={styles.strategyName}>{title}</Text>
                  <Text style={styles.strategyDesc}>{desc}</Text>
                  
                  <View style={styles.ballRow}>
                    {strategy.numbers.map((num: number, i: number) => (
                      <View key={i} style={globalStyles.ball}>
                        <Text style={globalStyles.ballText}>{num}</Text>
                      </View>
                    ))}
                    <View style={[globalStyles.ball, styles.superBall]}>
                      <Text style={[globalStyles.ballText, { color: '#fff' }]}>{strategy.super}</Text>
                    </View>
                  </View>
                </Animated.View>
              );
            })}

            {/* ACTION AREA: This controls the centering of the button */}
            <View style={styles.bottomActionArea}>
              <TouchableOpacity 
                style={[globalStyles.button, styles.centerBtn]} 
                onPress={fetchData}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{t.updateBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={{ color: theme.colors.superzahl, marginBottom: 10 }}>{error}</Text>
            <TouchableOpacity style={globalStyles.button} onPress={fetchData}>
               <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
