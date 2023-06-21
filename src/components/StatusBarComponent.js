import { useContext, useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../context/Context';

export const StatusBarComponent = () => {

    const { theme } = useContext(ThemeContext);
  
    useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle(theme == false ? 'dark-content' : 'light-content');
        Platform.OS === 'android' && StatusBar.setBackgroundColor(theme == false ? '#fffdd0' : '#323232');
      }, [theme]),
    );
  }