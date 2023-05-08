/* eslint-disable react-native/no-inline-styles */
import GradientView from 'component/GradientView';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';
import Button from 'react-native-ui-lib/button';
import R from 'res/R';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IoniconsIcon, FontAwesomeIcon } from 'res/icons';
import { createSelfIntroVideo } from 'utils/helper/help';
import { ScrollView } from 'react-native-gesture-handler';
import TextField from 'react-native-ui-lib/textField';

const ToggleItem = (props: any) => {
  const { icon, text, toggleSwitch } = props;
  const SWITCH_COLORS = {
    TRACK_FALSE: '#BABABA',
    TRACK_TRUE: '#02BE9A',
    STATE_ON: '#fff',
    STATE_OFF: '#fff',
    IOS_BACKGROUND: '#BABABA',
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={toggleSwitch.toggle}>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 16,
          marginVertical: 10,
          alignItems: 'center',
        }}>
        <GradientView
          style={{
            flexDirection: 'row',
            width: 50,
            height: 50,
            borderRadius: 35,
            marginHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesomeIcon name={icon} size={28} color={R.colours.light} />
        </GradientView>
        <Text marginL-10 text70Bold grey40 flex>
          {text}
        </Text>
        <Switch
          trackColor={{
            false: SWITCH_COLORS.TRACK_FALSE,
            true: SWITCH_COLORS.TRACK_TRUE,
          }}
          thumbColor={
            toggleSwitch.value
              ? SWITCH_COLORS.STATE_ON
              : SWITCH_COLORS.STATE_OFF
          }
          ios_backgroundColor={SWITCH_COLORS.IOS_BACKGROUND}
          value={toggleSwitch.value || toggleSwitch.value === undefined}
          onValueChange={toggleSwitch.toggle}
          style={{
            transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
            borderWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const PostScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const params = route?.params || '';
  const [togglePinterest, setTogglePinterest] = useState(false);
  const [toggleFaceBook, setToggleFaceBook] = useState(false);
  const [toggleTwitter, setToggleTwitter] = useState(false);
  const [toggleLinkedIn, setToggleLinkedIn] = useState(false);
  const [text, setText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

  const handlePost = async () => {
    try {
      setIsWaiting(true);
      const result = await createSelfIntroVideo(
        params.imageUri,
        params.text,
        params.audioUri,
      );
      console.log('result: ' + result);
      setIsWaiting(false);
      setText(result);
      setUri(result);
    } catch (error) {
      console.log('createSelfIntroVideo Error: ');
      setIsWaiting(false);
    }
  };

  const [uri, setUri] = useState('');

  return (
    <GradientView style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
        <IoniconsIcon
          name="ios-chevron-back-outline"
          size={30}
          color={R.colours.light}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text flex center text80Bold white>
          AI Text to Video
        </Text>
      </SafeAreaView>
      {/* <View flex bg-white /> */}
      <View flex bg-light style={{ justifyContent: 'flex-end' }}>
        <View>
          <Video
            source={{ uri: uri }}
            style={{
              margin: 12,
              backgroundColor: R.colours.dark,
              height: 250,
              borderRadius: 5,
            }}
            resizeMode="cover"
            repeat={true}
            controls={true}
          />
          <Button
            style={{
              ...styles.signInButton,
            }}
            onPress={handlePost}>
            <View>
              {!isWaiting ? (
                <Text text75Bold center light>
                  {'Generate Video'}
                </Text>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </Button>
        </View>
        <ScrollView>
          {/* End SignIn Button */}
          <View flex padding-10 style={{ justifyContent: 'center' }}>
            <ToggleItem
              icon="pinterest"
              text="#Pinterest"
              toggleSwitch={{
                value: togglePinterest,
                toggle: setTogglePinterest,
              }}
            />
            <ToggleItem
              icon="facebook-f"
              text="#FaceBook"
              toggleSwitch={{
                value: toggleFaceBook,
                toggle: setToggleFaceBook,
              }}
            />
            <ToggleItem
              icon="twitter"
              text="#Twitter"
              toggleSwitch={{
                value: toggleTwitter,
                toggle: setToggleTwitter,
              }}
            />
            <ToggleItem
              icon="linkedin"
              text="#LinkedIn"
              toggleSwitch={{
                value: toggleLinkedIn,
                toggle: setToggleLinkedIn,
              }}
            />
          </View>
          <Text text80Bold purple marginL-20>
            Video Url #
          </Text>
          <TextField
            hideUnderline
            multiline
            containerStyle={styles.textField}
            value={text}
            onChangeText={value => setText(value)}
          />
          <Button
            style={{
              ...styles.signInButton,
            }}
            onPress={() => {}}>
            <View>
              <Text text75Bold center light>
                {'Post Now'}
              </Text>
            </View>
          </Button>
          {/* End SignIn Button */}
        </ScrollView>
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
    height: 100,
    shadowColor: R.colours.dark,
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  signInButton: {
    backgroundColor: R.colours.greenDark,
    borderRadius: 100,
    borderWidth: 0,
    paddingVertical: 16,
    margin: 20,
    marginBottom: 30,
    shadowColor: R.colours.dark,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  deleteModalButton: {
    flex: 0,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 10,
    backgroundColor: R.colours.light,
    width: '40%',
    height: 50,
    justifyContent: 'center',
    alignContent: 'flex-end',
    borderRadius: 10,
  },
});

export default PostScreen;
