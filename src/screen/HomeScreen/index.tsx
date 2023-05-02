/* eslint-disable react-native/no-inline-styles */
import GradientView from 'component/GradientView';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';
import TextField from 'react-native-ui-lib/textField';
import Button from 'react-native-ui-lib/button';
import R from 'res/R';
import FastImage from 'react-native-fast-image';

const HomeScreen = () => {
  const [text, setText] = useState('');
  const navigation = useNavigation<any>();
  const handleContinue = () => {
    navigation.navigate('RecordingScreen', text);
  };
  return (
    <GradientView style={{ flex: 1 }}>
      <SafeAreaView>
        <Text center text80Bold white margin-10>
          AI Text to Video
        </Text>
      </SafeAreaView>
      {/* <View flex bg-white /> */}
      <View flex marginB-30 style={{ justifyContent: 'flex-end' }}>
        <FastImage
          resizeMode="contain"
          style={{ flex: 1 }}
          source={require('res/images/robot.png')}
        />
        <Text text80Bold purple marginL-20>
          ## Text for Video
        </Text>
        <TextField
          placeholder={'Please input your text for video'}
          autoFocus
          hideUnderline
          multiline
          containerStyle={styles.textField}
          value={text}
          onChangeText={value => setText(value)}
        />
        <Button
          style={{
            ...styles.signInButton,
            backgroundColor: text ? R.colours.light : '#aaa',
          }}
          onPress={handleContinue}
          disabled={!text}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              text80Bold
              center
              style={{
                color: text ? R.colours.greenBright : '#777',
              }}>
              {'Next'}
            </Text>
          </View>
        </Button>
        {/* End SignIn Button */}
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  textField: {
    margin: 10,
    padding: 20,
    backgroundColor: R.colours.light,
    borderRadius: 20,
    height: 300,
    shadowColor: R.colours.dark,
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  signInButton: {
    backgroundColor: R.colours.greenBright,
    borderRadius: 100,
    borderWidth: 0,
    paddingVertical: 14,
    margin: 20,
    shadowColor: R.colours.dark,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default HomeScreen;
