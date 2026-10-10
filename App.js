import React, { Suspense, lazy } from 'react';
import { Image, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

import { CartProvider } from './src/context/CartContext';
import CustomTabBar from './src/navigation/CustomTabBar';
import { ScreenSkeleton } from './src/components/Skeleton';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/theme';

// Lazy loading: these screens' code is only loaded the first time they open.
const LazyDish = lazy(() => import('./src/screens/DishScreen'));
const LazyCart = lazy(() => import('./src/screens/CartScreen'));
const LazyTracking = lazy(() => import('./src/screens/TrackingScreen'));

const withSuspense = (Screen) =>
  function Wrapped(props) {
    return (
      <Suspense fallback={<ScreenSkeleton />}>
        <Screen {...props} />
      </Suspense>
    );
  };

const DishScreen = withSuspense(LazyDish);
const CartScreen = withSuspense(LazyCart);
const TrackingScreen = withSuspense(LazyTracking);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  // Tab screens also mount lazily (bottom-tabs default), on first visit.
  return (
    <Tab.Navigator tabBar={(p) => <CustomTabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={TrackingScreen} />
    </Tab.Navigator>
  );
}

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg } };

export default function App() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('./assets/logo.png')} style={{ width: 120, height: 120 }} resizeMode="contain" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Dish" component={DishScreen} options={{ animation: 'slide_from_bottom' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}
