/* eslint-disable react-native/no-inline-styles */
import GradientView from 'component/GradientView';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';
import Button from 'react-native-ui-lib/button';
import Modal from 'react-native-ui-lib/modal';
import R from 'res/R';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  IoniconsIcon,
  FontAwesomeIcon,
  MaterialIcons,
  FontAwesome5Icon,
} from 'res/icons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const Card = (props: any) => {
  const {icon, text, onPress} = props;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <GradientView
        style={{
          height: 150,
          borderRadius: 16,
          marginVertical: 10,
          alignItems: 'center',
        }}>
        <View
          bg-light
          center
          marginT-20
          style={{width: 70, height: 70, borderRadius: 100}}>
          <FontAwesomeIcon name={icon} size={30} color={R.colours.greenDark} />
        </View>
        <Text marginT-10 text80Bold light>
          {text}
        </Text>
      </GradientView>
    </TouchableOpacity>
  );
};

const TakeSelfiModal = (props: any) => {
  const {show, setShow, setUri} = props;
  const [imagePath, setImagePath] = useState('');
  const handleClose = () => {
    setShow(!show);
  };
  const handleSave = () => {
    setUri(imagePath);
    setShow(!show);
  };
  const handleOpenImageLibrary = async () => {
    try {
      await launchImageLibrary(
        {mediaType: 'photo', selectionLimit: 1},
        async (res: any) => {
          if (res.assets) {
            const imageFile = res.assets[0];
            setImagePath(imageFile.uri);
            console.log(imageFile);
          } else {
            console.log(res);
          }
        },
      );
    } catch (error) {
      console.log('IMAGE_PICKER_SELECTION_FAILED', error);
    }
  };

  const handleOpenCamera = async () => {
    try {
      await launchCamera({mediaType: 'photo'}, async (res: any) => {
        if (res.assets) {
          const imageFile = res.assets[0];
          console.log(imageFile);
        }
      });
    } catch (error) {
      console.log('CAMERA_SELECTION_FAILED', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={show}
      overlayBackgroundColor={R.colours.bgOpacity3}
      transparent
      onBackgroundPress={() => setShow(false)}>
      <View flex center>
        <View>
          <View
            height={350}
            width={350}
            style={{
              borderRadius: 10,
              backgroundColor: 'white',
              marginBottom: -30,
            }}>
            {(!imagePath || imagePath.length === 0) && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IoniconsIcon
                  name={'md-person-circle'}
                  size={300}
                  color={R.colours.greyMid}
                />
              </View>
            )}
            {imagePath && imagePath.length > 0 && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FastImage
                  resizeMode="stretch"
                  style={{width: 350, height: 350, borderRadius: 10}}
                  source={{uri: imagePath}}
                />
              </View>
            )}
          </View>
          <View
            row
            marginR-10
            style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                margin: 3,
                backgroundColor: R.colours.greenDark,
              }}
              onPress={handleOpenCamera}>
              <MaterialIcons
                name={'add-a-photo'}
                size={35}
                color={R.colours.light}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                margin: 3,
                backgroundColor: R.colours.greenDark,
              }}
              onPress={handleOpenImageLibrary}>
              <MaterialIcons
                name={'add-photo-alternate'}
                size={35}
                color={R.colours.light}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View row>
          <Button style={styles.deleteModalButton} onPress={handleSave}>
            <Text text70Bold center red>
              Save
            </Text>
          </Button>
          <Button style={styles.deleteModalButton} onPress={handleClose}>
            <Text text70Bold center blue>
              Cancel
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const TakeVoiceModal = (props: any) => {
  const {show, setShow, setUri} = props;
  const handleClose = () => {
    setShow(!show);
  };
  const handleSave = () => {
    setUri(audioPath);
    setShow(!show);
  };
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');

  const onStartRecord = async () => {
    // const path = 'test.mp3';
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setIsRecording(true);
      audioRecorderPlayer.addRecordBackListener(e => {
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        );
        return;
      });
      console.log(result);
    } catch (err) {
      console.log('Audio recorder error: ' + err);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      setIsRecording(false);
      setAudioPath(result);
      console.log(result);
    } catch (err) {
      console.log('Audio stop error: ', err);
    }
  };

  const onStartPlay = async () => {
    try {
      console.log('onStartPlay');
      const msg = await audioRecorderPlayer.startPlayer();
      console.log(msg);
      audioRecorderPlayer.addPlayBackListener(e => {
        console.log(e);
        setCurrentPositionSec(e.currentPosition);
        setCurrentDurationSec(e.duration);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
        return;
      });
    } catch (error) {
      console.log('Audio start error: ', error);
    }
  };

  const onPausePlay = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
    } catch (error) {
      console.log('Audio Pause error', error);
    }
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const handleFilePicker = async () => {
    try {
      try {
        const pickerResult = await DocumentPicker.pickSingle({
          presentationStyle: 'fullScreen',
          copyTo: 'cachesDirectory',
          type: [DocumentPicker.types.audio],
        });
        console.log(pickerResult);
        setAudioPath(pickerResult.fileCopyUri || '');
      } catch (error) {
        console.log('FILE_PICKER_SELECTION_FAILED', error);
      }
    } catch (error) {
      console.log('FILE_PICKER_SELECTION_FAILED', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={show}
      overlayBackgroundColor={R.colours.bgOpacity3}
      transparent
      onBackgroundPress={() => setShow(false)}>
      <View flex center>
        <View>
          <View
            height={350}
            width={350}
            style={{
              borderRadius: 10,
              backgroundColor: 'white',
              marginBottom: -30,
            }}>
            {(isRecording || audioPath.length === 0) && (
              <View
                flex
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome5Icon
                  name={'microphone-alt'}
                  size={250}
                  color={!isRecording ? R.colours.greenDark : '#555500'}
                />
              </View>
            )}
            {!isRecording && audioPath.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={onStartPlay}>
                <FontAwesome5Icon
                  name={'play-circle'}
                  size={250}
                  color={R.colours.greenDark}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            row
            marginR-10
            style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                margin: 3,
                backgroundColor: R.colours.greenDark,
              }}
              onPressIn={() => {
                onStartRecord();
              }}
              onPressOut={() => onStopRecord()}>
              <IoniconsIcon
                name={'ios-mic-sharp'}
                size={35}
                color={R.colours.light}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                margin: 3,
                backgroundColor: R.colours.greenDark,
              }}
              onPress={handleFilePicker}>
              <FontAwesomeIcon
                name={'file-audio-o'}
                size={30}
                color={R.colours.light}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View row>
          <Button style={styles.deleteModalButton} onPress={handleSave}>
            <Text text70Bold center red>
              Save
            </Text>
          </Button>
          <Button style={styles.deleteModalButton} onPress={handleClose}>
            <Text text70Bold center blue>
              Cancel
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const RecordingScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const text = route?.params || '';
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [audioUri, setAudioUri] = useState('');

  return (
    <GradientView style={{flex: 1}}>
      <SafeAreaView
        style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
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
      <View flex bg-light style={{justifyContent: 'flex-end'}}>
        <View flex padding-10 style={{justifyContent: 'center'}}>
          <Card
            icon="camera-retro"
            text="Take a Selfie"
            onPress={() => {
              setShowPhotoModal(!showPhotoModal);
            }}
          />
          <Card
            icon="microphone"
            text="Record Your Voice"
            onPress={() => {
              setShowVoiceModal(!showVoiceModal);
            }}
          />
          <Card
            icon="address-card"
            text="Record Your Profile"
            onPress={() => {}}
          />
        </View>
        <Button
          style={{
            ...styles.signInButton,
            backgroundColor:
              imageUri.length && audioUri.length ? R.colours.greenDark : '#8a8',
          }}
          onPress={() => {
            navigation.navigate('PostScreen', {
              imageUri: imageUri,
              audioUri: audioUri,
              text: text,
            });
          }}
          disabled={!(imageUri.length && audioUri.length)}>
          <View>
            <Text text75Bold center light>
              {'Continue'}
            </Text>
          </View>
        </Button>
        {/* End SignIn Button */}
      </View>
      <TakeSelfiModal
        show={showPhotoModal}
        setShow={setShowPhotoModal}
        uri={imageUri}
        setUri={setImageUri}
      />
      <TakeVoiceModal
        show={showVoiceModal}
        setShow={setShowVoiceModal}
        uri={audioUri}
        setUri={setAudioUri}
      />
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
    shadowOffset: {width: 5, height: 10},
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
    shadowOffset: {width: 5, height: 5},
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

export default RecordingScreen;
