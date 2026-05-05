import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const theme = {
  colors: {
    primary: '#6366f1',
    accent: '#06b6d4',
    superzahl: '#f43f5e',
    background: '#f8fafc',
    glass: 'rgba(255, 255, 255, 0.9)',
    text: '#1e293b',
    textMuted: '#64748b',
    white: '#ffffff',
  }
};

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },
  glassCard: {
    backgroundColor: theme.colors.glass,
    borderRadius: 25,
    padding: 20,
    width: width > 600 ? 500 : width * 0.95, // Responsive width
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  // THIS FIXES THE LAYOUT:
  ballsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',        // Allows balls to go to the next line
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',           // Ensure it uses full card width
  },
  ball: {
    width: width > 400 ? 55 : 46, // Smaller on small phones
    height: width > 400 ? 55 : 46,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  ballText: {
    fontSize: width > 400 ? 18 : 15,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  }
});