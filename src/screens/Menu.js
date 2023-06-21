import React, { useContext } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Share,
    Linking,
    Alert,
    ScrollView,
} from 'react-native';
import AS_THEME from '@react-native-async-storage/async-storage';
import { Divider, List } from 'react-native-paper';
import { scale, verticalScale, moderateScale, moderateVerticalScale, ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../context/Context';
import { useNavigation } from '@react-navigation/native';
import Toggle from "react-native-toggle-element";
import { useInAppPurchase } from '../hooks/useInAppPurchase'
import Ionicons from 'react-native-vector-icons/Ionicons';


const Menu = () => {

    const { theme, setTheme } = useContext(ThemeContext);


    const {
        isFullAppPurchased,
        connectionErrorMsg,
        purchaseFullApp,
    } = useInAppPurchase();

    const navigation = useNavigation();

    // compartilha o link do app
    const onShareApp = async () => {
        Share.share({
            message: `Baixe 'O Literato' na Play Store: ` + 'https://play.google.com/store/apps/details?id=com.litteratus'
        })
    }


    // encaminha o usuario para avaliar o app na Play Store
    const onShareRate = async () => {

        const url = 'https://play.google.com/store/apps/details?id=com.litteratus';
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Esse link não é suportado no seu dispositivo');
        }
    }

    // encaminha o usuario para o perfil do desenvolvedor na Play Store
    const moreApps = async () => {

        const url = 'https://play.google.com/store/apps/developer?id=Filosofia+%26+Poemas';
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Esse link não é suportado no seu dispositivo');
        }
    }


    // encaminha o usuario para o gmail
    const onShareFeedback = async () => {

        const url = 'mailto:bgomes107fox@gmail.com?subject=O Literato - Feedback';
        const supported = await Linking.canOpenURL(url);


        if (supported) {
            return await Linking.openURL(url);
        } else {
            Alert.alert(`Não há como abrir o URL: ${url}`);
        }
    }


    // muda e salva o valor do tema
    const toggleTheme = async () => {

        const value = JSON.stringify(!theme);
        await AS_THEME.setItem("@Theme", value);
        setTheme(theme => !theme);
        console.log(value);
    }


    const styles = ScaledSheet.create({

        modoNoturno: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: '10@s',
            marginTop: '12@vs'
        },

        versionArea: {
            marginLeft: '10@s',
            paddingBottom: '185@mvs',
            marginTop: '65@vs',
            alignItems: 'center'
        }
    });



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme == false ? '#f5f5dc' : '#191919', justifyContent: 'center' }}>
            <ScrollView>
                <View style={{ marginTop: verticalScale(2) }}>
                    <Text style={{
                        fontSize: scale(100),
                        color: theme == false ? '#000' : '#e5e5e5',
                        fontFamily: 'icons',
                        textAlign: 'center',
                    }}>
                        \
                    </Text>
                </View>
                <View style={{ marginLeft: scale(10) }}>
                    <List.Section style={{ marginTop: 2 }}>
                        <List.Item
                            title='Compartilhe'
                            titleStyle={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}
                            description='Compartilhe poemas com os amigos.'
                            descriptionStyle={{ fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
                            left={() => <List.Icon color={theme == false ? '#000' : '#e5e5e5'} icon='share-variant-outline' />}
                            onPress={onShareApp}
                        />
                        <List.Item
                            title='Avalie'
                            titleStyle={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}
                            description='Avalie o aplicativo na Play Store.'
                            descriptionStyle={{ fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
                            left={() => <List.Icon color={theme == false ? '#000' : '#e5e5e5'} icon='star' />}
                            onPress={onShareRate}
                        />
                        <List.Item
                            title='Envie um feedback'
                            titleStyle={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}
                            description='Sua opinião é importante para aperfeiçoarmos nosso trabalho.'
                            descriptionStyle={{ fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
                            left={() => <List.Icon color={theme == false ? '#000' : '#e5e5e5'} icon='email' />}
                            theme={{ color: theme == false ? '#000' : '#e5e5e5' }}
                            onPress={onShareFeedback}
                        />
                        {/* {isFullAppPurchased ? (
                            <List.Item
                                title='Os anúncios foram removidos do seu app'
                                titleStyle={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}
                                descriptionStyle={{ fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
                                left={() => <List.Icon color='#ffdf00' icon='trophy' />}
                            />
                        ) : (
                            <List.Item
                                title='Remova os anúncios'
                                titleStyle={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}
                                description='Caso já tenha removido os anúncios anteriormente, pressione o botão para restaurar sua compra sem custos(requer conexão com a internet).'
                                descriptionNumberOfLines={5}
                                descriptionStyle={{ fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
                                left={() => <List.Icon color={theme == false ? '#000' : '#e5e5e5'} icon='advertisements-off' />}
                                onPress={purchaseFullApp}
                            />
                        )} */}
                        <List.Item
                            title='Mais Apps'
                            titleStyle={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}
                            description='Conheça outros Apps do desenvolvedor.'
                            descriptionStyle={{ fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
                            left={() => <List.Icon color={theme == false ? '#000' : '#e5e5e5'} icon='dots-horizontal' />}
                            theme={{ color: theme == false ? '#000' : '#e5e5e5' }}
                            onPress={moreApps}
                        />
                    </List.Section>
                </View>
                <Divider />
                <View style={{ marginLeft: scale(10) }}>
                    <List.Item
                        title='Notificações'
                        titleStyle={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}
                        description='Agende um horário e receba poemas aleatórios diariamente.'
                        descriptionStyle={{ fontSize: scale(10), color: theme == false ? '#000' : '#e5e5e5' }}
                        left={() => <List.Icon color={theme == false ? '#000' : '#e5e5e5'} icon='clock-edit' />}
                        onPress={() => navigation.navigate('Modal')}
                    />
                </View>
                <View style={styles.modoNoturno}>
                    <Text style={{ fontWeight: 'bold', fontSize: scale(12), color: theme == false ? '#000' : '#e5e5e5' }}>Modo escuro</Text>
                    <View style={{ marginLeft: scale(30) }}>
                        <Toggle
                            value={theme}
                            onPress={() => toggleTheme()}
                            thumbActiveComponent={
                                <Ionicons name="moon" size={scale(15)} color='#fff' fill={"#3BD2B5"} />
                            }
                            thumbInActiveComponent={
                                <Ionicons name="sunny" size={scale(15)} color='#ff0090' fill={"#03452C"} />
                            }
                            trackBar={{
                                activeBackgroundColor: "#9c27b0",
                                inActiveBackgroundColor: "#000",
                                borderActiveColor: "#673ab7",
                                borderInActiveColor: "#fffdd0",
                                borderWidth: scale(4),
                                width: scale(58),
                                height: verticalScale(28),
                            }}
                            thumbButton={{
                                width: 34,
                                height: 34,
                                radius: 17,
                                activeBackgroundColor: '#673ab7',
                                inActiveBackgroundColor: '#fffdd0'
                            }}
                        />
                    </View>
                </View>
                <View style={styles.versionArea}>
                    <Text style={{
                        fontSize: scale(12),
                        fontWeight: 'bold',
                        color: theme == false ? '#000' : '#e5e5e5'
                    }}>
                        Versão 1.1.6
                    </Text>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

export default Menu;