import React, { useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/Context';


const TopBar = () => {

  const { theme } = useContext(ThemeContext);

  const navigation = useNavigation();

  return (

    <SafeAreaView>
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme == false ? '#fffdd0' : '#323232',
        height: verticalScale(42)

      }}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{
            fontSize: scale(25), color: theme == false ? '#000' : '#e5e5e5',
            marginLeft: scale(14), fontFamily: 'icons'
          }}>
            \
          </Text>
          <Text style={{
            fontSize: scale(25), color: theme == false ? '#000' : '#e5e5e5',
            marginLeft: scale(5), fontFamily: 'frenchpress'
          }}>
            O Literato
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('SearchScreen')}
          style={{ marginRight: scale(20) }}
        >
          <Ionicons
            name='search'
            color={theme == false ? '#000' : '#e5e5e5'}
            size={scale(23)}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  );
}

export default TopBar;