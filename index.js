/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AndroidNotificationSetting,
    EventType,
    TriggerType,
    RepeatFrequency
} from '@notifee/react-native';
import AS_IDs from '@react-native-async-storage/async-storage';
import DATA from './src/data/Data';


notifee.onBackgroundEvent(async ({ type, detail }) => {

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

        } else {

            return null;
        };
    } else {
        await notifee.openAlarmPermissionSettings();
    }



});

AppRegistry.registerComponent(appName, () => App);