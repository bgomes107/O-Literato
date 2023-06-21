import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Datepicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TriggerType,
  AndroidVisibility,
  AndroidNotificationSetting
} from '@notifee/react-native';
import { Snackbar, List } from 'react-native-paper';
import { ThemeContext } from '../context/Context';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  ScaledSheet
} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AS_IDs from '@react-native-async-storage/async-storage';
import AS_STATUS from '@react-native-async-storage/async-storage';
import { useInAppPurchase } from '../hooks/useInAppPurchase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DATA from '../data/Data';


export const ModalPickers = () => {

  const [status, setStatus] = useState('false');
  const [favVisible, setFavVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [dates, setDates] = useState(new Date(Date.now()));
  const [notificationIds, setNotificationIds] = useState('');
  const { theme } = useContext(ThemeContext);
  const { isFullAppPurchased } = useInAppPurchase();



  useEffect(() => {
    renderId();
  }, []);


  const navigation = useNavigation();

  // fecha a tela
  const goBack = () => {
    navigation.goBack();
  };


  // agenda as notificações
  const onCreateTriggerNotification = async () => {

    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
      //Cria timestamp trigger
      const channelId = await notifee.createChannel({
        id: 'literatus',
        name: 'O Literato',
      });

      let now = new Date(Date.now());
      let diff = dates - now;

      if (diff < 0) {
        dates.setHours(dates.getHours() + 24);
      } else {
        dates
      }

      const trigger = {

        type: TriggerType.TIMESTAMP,
        timestamp: dates?.getTime(),
        alarmManager: {
          allowWhileIdle: true,
        },
        repeatFrequency: RepeatFrequency.DAILY,

      };


      const item = DATA[Math.floor(Math.random() * DATA.length)];


      await notifee.createTriggerNotification(

        {
          id: item.id,
          title: `${item.autor} te enviou um poema`,
          body: item.texto,
          android: {
            channelId,
            pressAction: {
              id: 'default',
              launchActivity: 'default'
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

      await AS_STATUS.setItem('@status', 'true');
      await AS_IDs.setItem('@id', item.id);
      setNotificationIds(item.id);
      setStatus('true');
      scheduleSnackBar();
    } else {
      // Show some user information to educate them on what exact alarm permission is,
      // and why it is necessary for your app functionality, then send them to system preferences:
      await notifee.openAlarmPermissionSettings();
    }




  };


  // renderiza o id para poder desabilitar depois
  const renderId = async () => {

    const id = await AS_IDs.getItem('@id');
    const stats = await AS_STATUS.getItem('@status');

    setStatus(stats);
    setNotificationIds(id);

    console.log(id);
    console.log(stats);

  };


  // desabilita as notificacoes
  const cancelNotifications = async () => {

    if (notificationIds && status === 'true') {

      await AS_IDs.removeItem('@id');
      await notifee.cancelTriggerNotification(notificationIds);
      disableSnackBar();

    }

    await AS_STATUS.setItem('@status', 'false');
    setStatus('false');

  };


  const scheduleSnackBar = () => setFavVisible(!favVisible);
  const disableSnackBar = () => setRemoveVisible(!removeVisible);
  const onDismissFav = () => setFavVisible(false);
  const onDismissRemov = () => setRemoveVisible(false);

  const styles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme == false ? '#f5f5dc' : '#191919',
    },

    datePickerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '30@mvs',
    },

    btnArea: {
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingTop: '25@mvs',
      flexDirection: 'row',
    },

    btnDesab: {
      width: '140@s',
      height: '30@vs',
      borderRadius: '6@s',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },

    btnAgend: {
      width: '140@s',
      height: '30@vs',
      borderRadius: '6@s',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },

    btnAgendado: {
      width: '140@s',
      height: '30@vs',
      borderRadius: '6@s',
      backgroundColor: '#39ff14',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },

    closeArea: {
      alignItems: 'center',
      paddingTop: '45@mvs',
    },

    btnClose: {
      width: '300@s',
      height: '30@vs',
      borderRadius: '6@s',
      backgroundColor: '#ff0000',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },

    infoArea: {
      marginTop: verticalScale(7),
      marginLeft: scale(22),
    }

  });


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.datePickerContainer}>
        <Text style={{
          paddingBottom: moderateVerticalScale(20),
          fontWeight: 'bold',
          color: theme == false ? '#000' : '#e5e5e5',
          fontSize: scale(10),
        }}
        >
          Selecione a hora
        </Text>
        <Datepicker
          mode='time'
          is24hourSource='device'
          fadeToColor={theme == false ? '#f5f5dc' : '#191919'}
          textColor={theme == false ? '#000' : '#e5e5e5'}
          androidVariant='iosClone'
          date={dates}
          onDateChange={date => setDates(date)}
          style={{ height: verticalScale(140) }}
        />
      </View>
      <View style={styles.infoArea}>
        <List.Item
          title='Se um horário já estiver agendado e você deseja substitui-lo por um novo, é necessário desabilitar o anterior primeiro.'
          titleStyle={{ fontWeight: 'bold', fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
          left={() => <List.Icon color={theme == false ? '#000' : '#e5e5e5'} icon='information-outline' />}
          titleNumberOfLines={3}
        />
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity
          onPress={() => cancelNotifications()}
          style={styles.btnDesab}>
          <MaterialIcons
            name='alarm-off'
            color='#000'
            size={scale(16)}
            style={{ marginRight: scale(4) }}
          />
          <Text style={{
            fontSize: scale(12),
            fontWeight: 'bold',
            color: '#000'
          }}>
            Desabilitar
          </Text>
        </TouchableOpacity>
        {status == 'true' ? (
          <TouchableOpacity
            style={styles.btnAgendado}>
            <MaterialIcons
              name='alarm-on'
              color='#fff'
              size={scale(16)}
              style={{ marginRight: scale(4) }}
            />
            <Text style={{
              fontSize: scale(12),
              fontWeight: 'bold',
              color: '#fff'
            }}>
              Agendado
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onCreateTriggerNotification()}
            style={styles.btnAgend}>
            <MaterialIcons
              name='add-alarm'
              color='#000'
              size={scale(16)}
              style={{ marginRight: scale(4) }}
            />
            <Text style={{
              fontSize: scale(12),
              fontWeight: 'bold',
              color: '#000'
            }}>
              Agendar
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.closeArea}>
        <TouchableOpacity
          onPress={() => goBack()}
          style={styles.btnClose}>
          <FontAwesome
            name='close'
            color='#fff'
            size={scale(16)}
            style={{ marginRight: scale(4) }}
          />
          <Text style={{
            fontSize: scale(12),
            fontWeight: 'bold',
            color: '#fff'
          }}>
            Fechar
          </Text>
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={favVisible}
        duration={2500}
        onDismiss={onDismissFav}
        elevation={5}
        style={{ backgroundColor: theme == false ? '#323232' : '#e5e5e5', marginBottom: isFullAppPurchased ? verticalScale(11) : verticalScale(67) }}
      >
        <Text style={{
          fontSize: scale(12),
          color: theme == false ? '#fff' : '#323232',
          textAlign: 'center',
          fontWeight: 'bold'
        }}
        >
          Notificações agendadas com sucesso!
        </Text>
      </Snackbar>
      <Snackbar
        visible={removeVisible}
        duration={2500}
        onDismiss={onDismissRemov}
        elevation={5}
        style={{ backgroundColor: theme == false ? '#323232' : '#e5e5e5', marginBottom: isFullAppPurchased ? verticalScale(11) : verticalScale(67) }}
      >
        <Text style={{
          fontSize: scale(12),
          color: theme == false ? '#fff' : '#323232',
          textAlign: 'center',
          fontWeight: 'bold'
        }}
        >
          As notificações foram desabilitadas!
        </Text>
      </Snackbar>
    </SafeAreaView>
  );
};