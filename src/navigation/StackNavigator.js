import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../context/Context';

// Telas
import Inicio from '../screens/Inicio';
import Autores from '../screens/Autores';
import camoesScreen from '../screens/camoesScreen';
import pessoaScreen from '../screens/pessoaScreen';
import machadoScreen from '../screens/machadoScreen';
import bilacScreen from '../screens/bilacScreen';
import florbelaScreen from '../screens/florbelaScreen';
import goncalvesScreen from '../screens/goncalvesScreen';
import castroScreen from '../screens/castroScreen';
import gregorioScreen from '../screens/gregorioScreen';
import Menu from '../screens/Menu';
import Favoritos from '../screens/Favoritos';
import SearchScreen from '../screens/SearchScreen';
import { ModalPickers } from '../components/ModalPickers';
import TopBar from '../components/TopBar';


// Inicio Stack Screens
const Home = createStackNavigator();

export const InicioStackScreen = () => {

  const { theme } = useContext(ThemeContext);

  return (

    <Home.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme == false ? '#fffdd0' : '#323232',
          height: verticalScale(42)
        },
        headerTitle: () => (
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{
              fontSize: scale(25), color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(14), fontFamily: 'icons'
            }}>
              \
            </Text>
            <Text style={{
              fontSize: scale(25),
              color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(7),
              fontFamily: 'frenchpress'
            }}>
              O Literato
            </Text>
          </View>

        ),
        headerTintColor: theme == false ? '#000' : '#e5e5e5',
      }}
    >
      <Home.Screen
        name="Inicio"
        component={Inicio}
        options={{
          header: () => <TopBar />
        }}
      />

      <Home.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
    </Home.Navigator>

  );
}


// Autores Stack Screens
const Autors = createStackNavigator();

export const AutoresStackScreen = () => {

  const { theme } = useContext(ThemeContext);

  return (

    <Autors.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme == false ? '#fffdd0' : '#323232',
          height: verticalScale(42)
        },
        headerTitle: () => (
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{
              fontSize: scale(25), color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(14), fontFamily: 'icons'
            }}>
              \
            </Text>
            <Text style={{
              fontSize: scale(25),
              color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(7),
              fontFamily: 'frenchpress'
            }}>
              O Literato
            </Text>
          </View>
        ),
        headerTintColor: theme == false ? '#000' : '#e5e5e5',
      }}
    >
      <Autors.Screen
        name="Autores"
        component={Autores}
        options={{
          header: () => <TopBar />
        }}
      />
      <Autors.Screen
        name="machadoScreen"
        component={machadoScreen}
        options={{
          title: false,
          presentation: 'modal'
        }}
      />
      <Autors.Screen
        name="camoesScreen"
        component={camoesScreen}
        options={{
          title: false,
          presentation: 'modal'
        }}
      />
      <Autors.Screen
        name="bilacScreen"
        component={bilacScreen}
        options={{
          title: false,
          presentation: 'modal'
        }}
      />
      <Autors.Screen
        name="pessoaScreen"
        component={pessoaScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
      <Autors.Screen
        name="florbelaScreen"
        component={florbelaScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
      <Autors.Screen
        name="castroScreen"
        component={castroScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
      <Autors.Screen
        name="goncalvesScreen"
        component={goncalvesScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
      <Autors.Screen
        name="gregorioScreen"
        component={gregorioScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
      <Autors.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
    </Autors.Navigator>



  )

}

// Favoritos Stack Screens
const Favorites = createStackNavigator();

export const FavoritosStackScreen = () => {

  const { theme } = useContext(ThemeContext);

  return (

    <Favorites.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme == false ? '#fffdd0' : '#323232',
          height: verticalScale(42)
        },
        headerTitle: () => (
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{
              fontSize: scale(25), color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(14), fontFamily: 'icons'
            }}>
              \
            </Text>
            <Text style={{
              fontSize: scale(25),
              color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(7),
              fontFamily: 'frenchpress'
            }}>
              O Literato
            </Text>
          </View>
        ),
        headerTintColor: theme == false ? '#000' : '#e5e5e5',
      }}
    >
      <Favorites.Screen
        name="Favorites"
        component={Favoritos}
        options={{
          header: () => <TopBar />
        }}
      />

      <Favorites.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: false,
          presentation: 'transparentModal'

        }}
      />
    </Favorites.Navigator>


  )
}

// Menu Stack Screens
const Settings = createStackNavigator();

export const MenuStackScreen = () => {

  const { theme } = useContext(ThemeContext);

  return (

    <Settings.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme == false ? '#fffdd0' : '#323232',
          height: verticalScale(42),
        },
        headerTitle: () => (
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{
              fontSize: scale(25), color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(14), fontFamily: 'icons'
            }}>
              \
            </Text>
            <Text style={{
              fontSize: scale(25),
              color: theme == false ? '#000' : '#e5e5e5',
              marginLeft: scale(7),
              fontFamily: 'frenchpress'
            }}>
              O Literato
            </Text>
          </View>
        ),
        headerTintColor: theme == false ? '#000' : '#e5e5e5',
      }}
    >
      <Settings.Screen
        name="Config"
        component={Menu}
        options={{
          header: () => <TopBar />
        }}
      />
      <Settings.Screen
        name="Modal"
        component={ModalPickers}
        options={{
          presentation: 'modal',
          title: false,
          headerLeft: false,
        }}
      />
      <Settings.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: false,
          presentation: 'transparentModal'
        }}
      />
    </Settings.Navigator>

  )
}