import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
// New high-performance chart library
import { BarChart } from "react-native-gifted-charts";
import { translations } from "../src/locals";
import { globalStyles, theme } from "../src/styles";

const { width: screenWidth } = Dimensions.get("window");

export default function StatsScreen() {
  /* --- 1. STATES --- */
  const [lang, setLang] = useState<"de" | "en">("de");
  const t = translations[lang];
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* --- 2. DATA FETCHING --- */
  const fetchStats = async () => {
    if (!refreshing) setLoading(true);
    setError(null);

    try {
      const url = "http://192.168.178.23:8000/statistics";
      const response = await axios.get(url);

      if (response.data && response.data.data) {
        const rawData = response.data.data;
        // Take top 7 most frequent numbers
        const finalData = Array.isArray(rawData) ? rawData.slice(0, 7) : [];
        setStatsData(finalData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error loading statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  /* --- 3. CHART DATA FORMATTING --- */
  // Transform backend data to GiftedCharts format
  const formattedChartData = statsData.map((item) => ({
    value: item.frequency,
    label: item.number.toString(),
    frontColor: theme.colors.primary, // Using your theme color
    gradientColor: '#FF4500',
  }));

  /* --- 4. CALCULATIONS FOR DYNAMIC CHART SCALING --- */
  // Calculate min and max frequencies outside the JSX to avoid rendering errors.
  // This allows us to cut off the bottom of the bars so differences are visually obvious.
  const minFreq = statsData.length > 0 ? Math.min(...statsData.map(i => i.frequency)) : 0;
  const maxFreq = statsData.length > 0 ? Math.max(...statsData.map(i => i.frequency)) : 100;

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00FF7F" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#6495ED" }}>
      <ScrollView
        contentContainerStyle={{ padding: 15, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF7F" />
        }
      >
        {/* Language Switcher */}
        <TouchableOpacity
          onPress={() => setLang(lang === "de" ? "en" : "de")}
          style={styles.langBtn}
        >
          <Text style={styles.langText}>
            {lang === "de" ? "🇩🇪 DE" : "🇺🇸 EN"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>{t.title}</Text>

        {/* MODERN BAR CHART CARD */}
        <View style={[globalStyles.glassCard, styles.chartCard]}>
          <Text style={styles.cardHeader}>
            {lang === "de" ? "Heiße Zahlen" : "Hot Numbers"}
          </Text>

          {statsData.length > 0 ? (
            <View style={styles.chartWrapper}>
              <BarChart
                data={formattedChartData}
                barWidth={25}
                spacing={20}
                roundedTop
                isAnimated
                animationDuration={1000}
                
                // Dynamic scaling: start the chart slightly below the lowest number, 
                // and cap it slightly above the highest number.
                yAxisOffset={Math.max(0, minFreq - 15)} 
                maxValue={maxFreq + 5}
                noOfSections={5}

                // Clean look: remove axes and grids
                hideYAxisText         // Removes the numbers on the left
                yAxisThickness={0}    // Removes the vertical line
                xAxisThickness={0}    // Removes the horizontal line
                hideRules             // Removes background grid lines
                initialSpacing={10}   // Small space before the first bar
                
                // Styling
                xAxisLabelTextStyle={styles.chartLabel}
              />
            </View>
          ) : (
            <Text style={styles.noDataText}>{error || "No data available"}</Text>
          )}
        </View>

        {/* FREQUENCY DETAILS LIST */}
        <View style={[globalStyles.glassCard, styles.listCard]}>
          <Text style={styles.listHeader}>
            {lang === "de" ? "Häufigkeitsdetails" : "Frequency Details"}
          </Text>

          {statsData.map((item, index) => (
            <View key={`stat-${index}`} style={styles.listItem}>
              <View style={styles.itemLeft}>
                <View style={styles.ballIcon}>
                  <Text style={styles.ballText}>{item.number}</Text>
                </View>
                <Text style={styles.itemLabel}>
                  {lang === "de" ? "Nummer" : "Number"} {item.number}
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.frequency} {lang === "de" ? "Mal" : "times"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1, 
    justifyContent: "center", 
    backgroundColor: "#6495ED"
  },
  langBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#e8f5e9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 25,
    elevation: 4,
  },
  langText: { 
    fontWeight: "bold", 
    color: "#2e7d32", 
    fontSize: 16 
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#00FF7F",
    marginBottom: 20,
    textAlign: "center",
  },
  chartCard: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  cardHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#2e7d32",
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    marginLeft: -10, // Slight adjustment for perfect centering
  },
  chartLabel: {
    color: '#444', 
    fontWeight: 'bold', 
    fontSize: 12
  },
  listCard: {
    marginTop: 25,
    padding: 20,
    borderRadius: 25
  },
  listHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemLeft: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  ballIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ballText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  itemLabel: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#444" 
  },
  badge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  badgeText: { 
    fontWeight: "bold", 
    color: "#2E7D32" 
  },
  noDataText: { 
    color: "#666", 
    marginVertical: 20 
  }
});