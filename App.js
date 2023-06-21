import { useEffect, useState, useContext } from 'react';
import { Modal, View, Text, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './src/navigation/TabNavigation';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AS_IDs from '@react-native-async-storage/async-storage';
import AS_THEME from '@react-native-async-storage/async-storage';
import { ContextProvider } from './src/context/Context';
import notifee, {
  EventType,
  RepeatFrequency,
  TriggerType,
  AndroidImportance,
  AndroidVisibility,
  AndroidNotificationSetting,
  AuthorizationStatus
} from '@notifee/react-native';
import { StatusBarComponent } from './src/components/StatusBarComponent';
import { ThemeContext } from './src/context/Context';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  ScaledSheet
} from 'react-native-size-matters';
import DATA from './src/data/Data';
import { withIAPContext } from 'react-native-iap';


const App = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [favorite, setFavorite] = useState([]);
  const [notificationId, setNotificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);


  const requestPermission = async () => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      console.log('Permissão para notificações concedida');
    } else {
      console.log('Permissão para notificações negada');
    }
  }


  useEffect(() => {
    requestPermission();
    SplashScreen.hide();
  }, []);


  useEffect(() => {
    bootstrap()
      .then(data => setNotificationId(data), setLoading(false))
      .catch(console.error)
  }, []);


  useEffect(() => {

    return notifee.onForegroundEvent(async ({ type, detail }) => {

      const settings = await notifee.getNotificationSettings();

      if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {

        if (type === EventType.DELIVERED) {

          const time = new Date(Date.now());

          const id = await AS_IDs.getItem('@id');

          await notifee.cancelTriggerNotification(id);

          if (id) await AS_IDs.removeItem('@id');

          const item = DATA[Math.floor(Math.random() * DATA.length)];

          const channelId = await notifee.createChannel({
            id: 'literatus',
            name: 'O Literato',
          });

          const trigger = {

            type: TriggerType.TIMESTAMP,
            timestamp: time.setTime(time.getTime() + (24 * 60 * 60 * 1000)),
            alarmManager: {
              allowWhileIdle: true,
            },
            repeatFrequency: RepeatFrequency.DAILY,

          };

          await notifee.createTriggerNotification(

            {
              id: item.id,
              title: `${item.autor} te enviou um poema`,
              body: item.texto,
              android: {
                channelId,
                pressAction: {
                  id: 'default',
                  launchActivity: 'default',
                },
                importance: AndroidImportance.HIGH,
                showTimestamp: true,
                visibility: AndroidVisibility.PUBLIC,
                sound: 'default',
                smallIcon: '@mipmap/small_icon',
                color: '#323232'
              }
            },
            trigger,
          );
          await AS_IDs.setItem('@id', item.id);

        } else if (type === EventType.PRESS) {

          bootstrap()
            .then(data => setNotificationId(data), setLoading(false), setModalVisible(true))
            .catch(console.error)
          renderFavorite();
        } else {
          return null;
        }
      } else {
        await notifee.openAlarmPermissionSettings();
      }


    });

  }, []);


  if (loading) {
    return null;
  }


  const bootstrap = async () => {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      setModalVisible(true);
      renderFavorite();
      return initialNotification.notification.id;
    }

  }

  // renderiza o valor do tema
  const renderTheme = async () => {

    const values = await AS_THEME.getItem('@Theme');
    if (values !== null) {
      setTheme(JSON.parse(values));
    } else {
      console.log('Não há estado aqui')
    }

  }


  // adiciona ao storage
  const saveFavorite = async (data_quotes) => {

    try {
      const valor = await AsyncStorage.getItem('@ID');
      const res = JSON.parse(valor);
      if (res !== null) {
        let data = res.find(value => value.id == data_quotes.id);
        if (data == null) {
          res.push(data_quotes);
          console.log(res);
          AsyncStorage.setItem('@ID', JSON.stringify(res));
          setFavorite(res);

        }


      } else {
        let favorites = [];
        favorites.push(data_quotes);
        AsyncStorage.setItem('@ID', JSON.stringify(favorites));
        setFavorite(favorites);
        console.log(favorites);
      }
    } catch (error) {
      console.log(error);
    }

  };

  // remove a citacao dos favoritos
  const removeFavorite = async (data_quotes) => {

    try {
      const quote = await AsyncStorage.getItem('@ID');
      let quoteFav = JSON.parse(quote);
      const quoteItems = quoteFav.filter((e) => {
        return e.id !== data_quotes.id;
      });
      await AsyncStorage.setItem('@ID', JSON.stringify(quoteItems));
      setFavorite(quoteItems);
      console.log(quoteItems);
    } catch (error) {
      console.log(error);
    }

  };


  // renderiza a citacao no useEffect
  const renderFavorite = async () => {

    try {
      const token = await AsyncStorage.getItem('@ID')
      const res = JSON.parse(token);
      setFavorite(res);

    } catch (error) {
      console.log(error);
    }

  };

  const styles = ScaledSheet.create({

    autor: {
      fontSize: '21@s',
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'left',
      marginLeft: '15@s'

    },

    titulo: {
      fontSize: '15@s',
      fontWeight: 'bold',
      textAlign: 'left',
      marginLeft: '14@s',
      color: '#000',
    },

    line: {
      backgroundColor: '#000',
      height: '0.9@vs',
      margin: '20@ms',
      marginTop: '16@vs'
    },

    texto: {
      fontSize: '13@s',
      fontWeight: 'bold',
      marginTop: '5@vs',
      color: '#000',
      textAlign: 'left'
    },

    obra: {
      fontSize: '13@s',
      fontWeight: 'bold',
      color: '#000',
      marginTop: '17@vs',
      marginLeft: '15@s',
      textAlign: 'left',
      paddingBottom: moderateVerticalScale(100)
    },
  })

  // pega o id da notificacao que abriu o app
  const data = DATA.find((item) => item.id == notificationId);

  return (

    <ContextProvider>
      <NavigationContainer>
        <StatusBarComponent />
        <TabNavigation />
        <Modal
          visible={modalVisible}
          statusBarTranslucent
          animationType='slide'
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{
              backgroundColor: '#e5e4e2',
              paddingTop: verticalScale(18),
              height: verticalScale(65)
            }}>
              <IconButton
                onPress={() => setModalVisible(false)}
                icon='keyboard-backspace'
                iconColor={theme == false ? '#fff' : '#000'}
                size={scale(23)}
              />
            </View>
            <ScrollView style={{ flex: 1, backgroundColor: '#e5e4e2' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.autor}>{data?.autor}</Text>
                <View style={{ marginRight: scale(10) }}>
                  {favorite?.find(value => value.id === data?.id) ? (
                    <IconButton
                      onPress={() => removeFavorite(data)}
                      icon='cards-heart'
                      iconColor='#000'
                      size={scale(24)}
                      animated={true}
                    />

                  ) : (
                    <IconButton
                      onPress={() => saveFavorite(data)}
                      icon='cards-heart-outline'
                      iconColor='#000'
                      size={scale(24)}
                      animated={true}
                    />
                  )}
                </View>
              </View>
              <View style={styles.line} />
              <View style={{
                alignItems: 'flex-start',
                marginLeft: scale(12),
              }}>
                <Text style={styles.titulo}>{data?.titulo}</Text>
                <Text style={styles.texto}>{data?.texto}</Text>
                <Text style={styles.obra}>{data?.obra}</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </NavigationContainer>
    </ContextProvider>


  );
};



export default withIAPContext(App);