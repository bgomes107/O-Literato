import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Share,
    ActivityIndicator,
} from 'react-native';
import { Card, Title, Paragraph, IconButton, Snackbar } from 'react-native-paper';
import { FlashList } from "@shopify/flash-list";
import {
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
    ScaledSheet
} from 'react-native-size-matters';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext } from '../context/Context';
import { useInAppPurchase } from '../hooks/useInAppPurchase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DATA from '../data/Data';


const Inicio = () => {

    const [favorite, setFavorite] = useState([]);
    const [item, setItem] = useState(DATA);
    const [spinner, setSpinner] = useState(true);
    const [favVisible, setFavVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);
    const { isFullAppPurchased } = useInAppPurchase();
    const { theme } = useContext(ThemeContext);

    const isFocused = useIsFocused();


    useEffect(() => {
        renderFavorite();
    }, [isFocused]);

    useEffect(() => {
        getItems().then((item) => {
            setItem(item);
            setSpinner(false);
        });
    }, []);


    const getItems = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let newArr = item.sort(() => Math.random() - 0.5);

        return newArr;
    }


    // compartilha a citacao
    const onShareQuote = async (nome, texto) => {
        await Share.share({
            message: texto + '\n' + '\n' + nome + '\n' + 'https://play.google.com/store/apps/details?id=com.litteratus'
        });
    };

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
                    favoriteSnackBar();
                    AsyncStorage.setItem('@ID', JSON.stringify(res));
                    setFavorite(res);

                }


            } else {
                let favorites = [];
                favorites.push(data_quotes);
                AsyncStorage.setItem('@ID', JSON.stringify(favorites));
                setFavorite(favorites);
                favoriteSnackBar();
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
            removeSnackBar();
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


    // Snackbar de adicionar e remover dos favoritos
    const favoriteSnackBar = () => setFavVisible(!favVisible);
    const removeSnackBar = () => setRemoveVisible(!removeVisible);
    const onDismissFav = () => setFavVisible(false);
    const onDismissRemov = () => setRemoveVisible(false);

    const styles = ScaledSheet.create({

        container: {
            flex: 1,
            backgroundColor: theme == false ? '#f5f5dc' : '#323232'
        },

        item: {
            backgroundColor: theme == false ? '#000' : '#323232',
            padding: '12@ms',
        },

        titleContainer: {
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6@vs',
            marginLeft: '12@s',
            flexDirection: 'row'
        },

        title: {
            fontSize: '14@s',
            fontWeight: 'bold',
            color: theme == false ? '#000' : '#e5e5e5',
            marginLeft: '25@s',
            marginTop: '9@vs',
        },

        subTitle: {
            fontSize: '20@s',
            fontWeight: 'bold',
            color: theme == false ? '#000' : '#e5e5e5',
        },

        textContainer: {
            flex: 1,
            padding: '12@ms'
        },

        texto: {
            fontSize: '12@s',
            fontWeight: 'bold',
            color: theme == false ? '#000' : '#e5e5e5',
            marginTop: '4@vs',
            textAlign: 'left'
        },

        obra: {
            fontSize: '12@s',
            fontWeight: 'bold',
            color: theme == false ? '#000' : '#e5e5e5',
            marginTop: '9@vs',
            marginLeft: '15@s'
        },

        autor: {
            fontSize: '12@s',
            fontWeight: 'bold',
            color: theme == false ? '#000' : '#e5e5e5',
            marginTop: '9@vs',
            marginLeft: '15@s'
        },

        btnArea: {
            flexDirection: 'row',
            paddingTop: '12@mvs',
            justifyContent: 'space-between'
        }


    });


    return (

        <SafeAreaView style={styles.container}>
            {spinner ? (
                <ActivityIndicator
                    animating={true}
                    size='large'
                    color={theme == false ? '#000' : '#e5e5e5'}
                    style={{
                        flex: 1,
                        marginTop: verticalScale(85),
                    }}
                />
            ) : (
                <FlashList
                    data={item}
                    contentContainerStyle={{ paddingBottom: moderateVerticalScale(80) }}
                    extraData={{ favorite, theme }}
                    estimatedItemSize={250}
                    renderItem={({ index, item }) => (
                        <View style={{ padding: moderateScale(12), backgroundColor: theme == false ? '#f5f5dc' : '#191919' }}>
                            <Card
                                style={{ backgroundColor: theme == false ? '#fff' : '#323232' }}
                            >
                                <Title style={styles.title}>{item.titulo}</Title>
                                <Card.Content>
                                    <Paragraph style={styles.texto}>{item.texto}</Paragraph>
                                </Card.Content>
                                <Card.Content>
                                    <Text style={styles.autor}>{item.autor}</Text>
                                </Card.Content>
                                <Card.Content>
                                    <Text style={styles.obra}>{item.obra}</Text>
                                </Card.Content>
                                <Card.Actions style={styles.btnArea}>
                                    <IconButton
                                        onPress={() => onShareQuote(item.autor, item.texto)}
                                        icon='share'
                                        iconColor={theme == false ? '#ff0090' : '#1f51ff'}
                                        containerColor={theme == false ? '#f5f5dc' : '#191919'}
                                        size={scale(21)}
                                        mode='contained-tonal'
                                        animated={true}
                                    />
                                    {favorite?.find(value => value.id === item.id) ? (
                                        <IconButton
                                            onPress={() => removeFavorite(item)}
                                            icon='cards-heart'
                                            iconColor={theme == false ? '#ff0090' : '#1f51ff'}
                                            containerColor={theme == false ? '#f5f5dc' : '#191919'}
                                            size={scale(21)}
                                            mode='contained-tonal'
                                            animated={true}
                                        />

                                    ) : (
                                        <IconButton
                                            onPress={() => saveFavorite(item)}
                                            icon='cards-heart-outline'
                                            iconColor={theme == false ? '#ff0090' : '#1f51ff'}
                                            containerColor={theme == false ? '#f5f5dc' : '#191919'}
                                            size={scale(21)}
                                            mode='contained-tonal'
                                            animated={true}
                                        />
                                    )}
                                </Card.Actions>
                            </Card>
                        </View>
                    )}
                />
            )}
            <Snackbar
                visible={favVisible}
                duration={2000}
                onDismiss={onDismissFav}
                elevation={5}
                style={{ backgroundColor: theme == false ? '#323232' : '#e5e5e5', marginBottom: isFullAppPurchased ? verticalScale(11) : verticalScale(68) }}
            >
                <Text style={{
                    fontSize: scale(12),
                    color: theme == false ? '#fff' : '#323232',
                    textAlign: 'center',
                    fontWeight: 'bold',
                }}
                >
                    Adicionado aos Favoritos!
                </Text>
            </Snackbar>
            <Snackbar
                visible={removeVisible}
                duration={2000}
                onDismiss={onDismissRemov}
                elevation={5}
                style={{ backgroundColor: theme == false ? '#323232' : '#e5e5e5', marginBottom: isFullAppPurchased ? verticalScale(11) : verticalScale(68) }}
            >
                <Text style={{
                    fontSize: scale(12),
                    color: theme == false ? '#fff' : '#323232',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
                >
                    Removido dos Favoritos!
                </Text>
            </Snackbar>

        </SafeAreaView >
    );
}


export default Inicio;