import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Share,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext } from '../context/Context';
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useInAppPurchase } from '../hooks/useInAppPurchase';
import { Card, Title, Paragraph, IconButton, Snackbar } from 'react-native-paper';
import { scale, verticalScale, moderateScale, ScaledSheet, moderateVerticalScale } from 'react-native-size-matters';


const Favoritos = () => {

    const [dataId, setDataId] = useState([]);
    const [removeVisible, setRemoveVisible] = useState(false);
    const { theme } = useContext(ThemeContext);
    const { isFullAppPurchased } = useInAppPurchase();

    const isFocused = useIsFocused();

    useEffect(() => {
        fetchFavorite();
    }, [isFocused]);


    // compartilha a citacao
    const onShareQuote = async (nome, texto) => {
        await Share.share({
            message: texto + '\n' + '\n' + nome + '\n' + 'https://play.google.com/store/apps/details?id=com.litteratus'
        });
    };


    // busca o data no asyncstorage
    const fetchFavorite = async () => {
        const token = await AsyncStorage.getItem('@ID');
        const res = JSON.parse(token);
        // setisloading(true);
        if (res) {
            setDataId(res);
            console.log(res);
            // setisloading(false);
        } else {
            setDataId([]);
            // setisloading(false);
        }

    };


    // remove a citacao dos favoritos
    const removeFavorite = async (data_quotes) => {

        try {
            const quote = await AsyncStorage.getItem('@ID');
            let quoteFav = JSON.parse(quote);
            const quoteItems = quoteFav.filter((e) => {
                return e.id !== data_quotes.id
            });
            setDataId(quoteItems);
            await AsyncStorage.setItem('@ID', JSON.stringify(quoteItems));
            removeSnackBar();
            console.log(quoteItems);
        } catch (error) {
            console.log(error)
        }

    };

    // separador
    const ItemSeparatorView = () => {
        return (
            <View
                style={{
                    height: verticalScale(5),
                }}
            />
        );
    };

    const removeSnackBar = () => setRemoveVisible(!removeVisible);
    const onDismissRemov = () => setRemoveVisible(false);

    const styles = ScaledSheet.create({
        container: {
            backgroundColor: theme == false ? '#f5f5dc' : '#191919',
            flex: 1,
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
            {dataId.length == 0 ? (
                <View style={{
                    flex: 1, backgroundColor: theme == false ? '#f5f5dc' : '#191919',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: scale(16),
                        fontWeight: 'bold',
                        color: theme == false ? '#000' : '#e5e5e5'
                    }}>
                        Não foram encontrados favoritos
                    </Text>
                </View>

            ) : (
                <FlashList
                    data={dataId}
                    keyExtractor={(item, index) => String(index)}
                    extraData={theme}
                    contentContainerStyle={{ paddingBottom: moderateVerticalScale(80) }}
                    estimatedItemSize={250}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={({ index, item }) => (
                        <View style={{ padding: moderateScale(12) }}>
                            <Card style={{ backgroundColor: theme == false ? '#fff' : '#323232', padding: moderateScale(3) }}>
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

                                    <IconButton
                                        onPress={() => removeFavorite(item)}
                                        icon='delete'
                                        iconColor={theme == false ? '#ff0090' : '#1f51ff'}
                                        containerColor={theme == false ? '#f5f5dc' : '#191919'}
                                        size={scale(21)}
                                        mode='contained-tonal'
                                    />
                                </Card.Actions>
                            </Card>
                        </View>
                    )}
                />
            )}
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

export default Favoritos;
