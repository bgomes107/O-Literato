import { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import { View, KeyboardAvoidingView } from 'react-native';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import useKeyboard from '../components/KeyboardEvents';
import { useInAppPurchase } from '../hooks/useInAppPurchase';
import { ThemeContext } from '../context/Context';

// telas
import {
  AutoresStackScreen,
  InicioStackScreen,
  FavoritosStackScreen,
  MenuStackScreen
} from "./StackNavigator";

const adUnitId = __DEV__ ? TestIds.BANNER : "";

const Tab = createBottomTabNavigator();


const TabNavigation = () => {

  const { theme } = useContext(ThemeContext);
  const { isFullAppPurchased } = useInAppPurchase();
  const isKeyboardOpen = useKeyboard();

  return (

    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Início"
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: theme == false ? "#ff0090" : '#1f51ff',
          tabBarInactiveTintColor: theme == false ? "#000" : '#fff',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme == false ? '#fffdd0' : '#323232',
            borderTopColor: theme == false ? '#fffdd0' : '#323232',
            height: verticalScale(52),

          }
        }}
      >
        <Tab.Screen
          name="Início"
          component={InicioStackScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <MaterialCommunityIcons name="home" color={color} size={scale(21)} />
            ),
            tabBarLabelStyle: {
              fontWeight: 'bold'
            }
          }}
        />
        <Tab.Screen
          name="Autores"
          component={AutoresStackScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="book-account" color={color} size={scale(21)} />
            ),
            tabBarLabelStyle: {
              fontWeight: 'bold'
            }
          }}
        />
        <Tab.Screen
          name="Favoritos"
          component={FavoritosStackScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="heart" color={color} size={scale(21)} />
            ),
            tabBarLabelStyle: {
              fontWeight: 'bold'
            }
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuStackScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="menu" color={color} size={scale(21)} />
            ),
            tabBarLabelStyle: {
              fontWeight: 'bold'
            }
          }}
        />
      </Tab.Navigator>
      {isFullAppPurchased ? (
        null
      ) : (
        <KeyboardAvoidingView
          behavior='height'
          style={{
            position: 'absolute',
            bottom: isKeyboardOpen ? verticalScale(-3) : verticalScale(51),
            width: '100%',
          }}

        >
          <BannerAd
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            unitId={adUnitId}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  );
}


export default TabNavigation;
