import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Share,
} from 'react-native';
import { Searchbar, Card, Title, Paragraph, IconButton, Snackbar } from 'react-native-paper';
import { scale, verticalScale, moderateScale, moderateVerticalScale, ScaledSheet } from 'react-native-size-matters';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { ThemeContext } from '../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useInAppPurchase } from '../hooks/useInAppPurchase';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import useKeyboard from '../components/KeyboardEvents';
import DATA from '../data/Data';


const SearchScreen = () => {

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState(DATA);
    const [favorite, setFavorite] = useState([]);
    const [favVisible, setFavVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);
    const isKeyboardOpen = useKeyboard();
    const { theme } = useContext(ThemeContext);
    const { isFullAppPurchased } = useInAppPurchase();

    const favoriteSnackBar = () => setFavVisible(!favVisible);
    const removeSnackBar = () => setRemoveVisible(!removeVisible);
    const onDismissFav = () => setFavVisible(false);
    const onDismissRemov = () => setRemoveVisible(false);


    const isFocused = useIsFocused();

    useEffect(() => {
        renderFavorite();
    }, [isFocused]);


    // compartilha a citacao
    const onShareQuote = async (nome, texto) => {
        await Share.share({
            message: texto + '\n' + '\n' + nome + '\n' + 'https://play.google.com/store/apps/details?id=com.litteratus'
        });
    };


    // adiciona ao storage
    const saveFavorite = async (data_quotes) => {

        try {
            valor = await AsyncStorage.getItem('@ID');
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

    }


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


    const searchFilterFunction = (text) => {

        if (text) {
            const newData = masterDataSource.filter(
                function (item) {
                    const itemData = item.texto || item.titulo
                        ? item.texto.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") + item.titulo.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                        : ''.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    const textData = text.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {

            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };


    const ItemView = ({ item }) => {

        return (

            <View style={{ padding: moderateScale(12), backgroundColor: theme == false ? '#f5f5dc' : '#191919' }}>
                <Card mode='elevated' style={{ backgroundColor: theme == false ? '#fff' : '#323232', padding: moderateScale(3) }}>
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
        );
    };

    // separador
    const ItemSeparatorView = () => {
        return (
            <View
                style={{
                    height: verticalScale(5),
                    width: '100%',

                }}
            />
        );
    };


    const styles = ScaledSheet.create({

        container: {
            flex: 1,
            backgroundColor: theme == false ? '#f5f5dc' : '#191919',
        },

        textInputStyle: {
            height: '52@vs',
            backgroundColor: theme == false ? '#f5f5dc' : '#191919',
            borderTopColor: theme == false ? '#f5f5dc' : '#191919',

        },

        title: {
            fontSize: '14@s',
            fontWeight: 'bold',
            color: theme == false ? '#000' : '#e5e5e5',
            marginLeft: '25@s',
            marginTop: '9@vs',
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
            <Searchbar
                style={styles.textInputStyle}
                autoFocus={true}
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
                iconColor={theme == false ? '#000' : '#e5e5e5'}
                underlineColorAndroid="transparent"
                placeholder="Pesquise pelo texto ou título..."
                placeholderTextColor='#666666'
                clearIcon={() => (
                    <EvilIcons name='close' color={theme == false ? '#000' : '#e5e5e5'} size={scale(21)} />
                )}
                inputStyle={{
                    fontSize: scale(13),
                    color: theme == false ? '#000' : '#e5e5e5',
                }}
            />
            {search == 0 ? null : (
                <FlashList
                    data={filteredDataSource}
                    contentContainerStyle={{ paddingBottom: moderateVerticalScale(80) }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={{ favorite, theme }}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                    estimatedItemSize={250}
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
                    fontWeight: 'bold'
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
        </SafeAreaView>
    );
};

export default SearchScreen;
