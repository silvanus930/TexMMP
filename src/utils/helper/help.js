import { AudioUtils } from 'react-native-audio';
import { FileSystem } from 'react-native-unimodules';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import { createTalk, getTalkById } from './DID/did';
import { generateAudioWithVoiceAndText, addVoice } from './elevenlab/elevenlab';
import { uploadImageFile, uploadAudioFile } from './Utils/uploadUtil';

export async function createSelfIntroVideo(
  local_image_url,
  local_text,
  local_audio_url,
) {
  console.log('Image URL: ' + local_image_url);
  console.log('Text: ' + local_text);
  console.log('Audio URL: ' + local_audio_url);
  // upload image to online store

  let remote_image_url;
  try {
    remote_image_url = await uploadImageFile(local_image_url);
    console.log('Image URL: ' + remote_image_url);
  } catch (error) {
    console.log('Error uploading image: ' + error.message);
  }

  // add voice
  var formdata = new FormData();
  formdata.append('name', 'voice');
  formdata.append('files', [
    {
      uri: local_audio_url,
      name: local_audio_url.split('/').pop(),
      type: 'audio/mpeg',
    },
  ]);

  let voice_id = 'W2TeetKrcgLVT9WkK3nK';
  // let voice_id;
  // try {
  //   voice_id = await addVoice(formdata);
  //   console.log('VoiceID for Eleventh: ' + voice_id);
  // } catch (error) {
  //   console.log('Voice for Eleven Error: ' + error.message);
  // }

  // generate audio with voice id and text
  let res;
  try {
    res = await generateAudioWithVoiceAndText(voice_id, local_text);
    console.log('Response from VoiceID: ' + res);
  } catch (error) {
    console.log('Text for Voice Error: ' + error.message);
  }

  // console.log('Audio generated:' + JSON.stringify(res.body));
  // var reader = res._bodyInit.getReader();
  //     // when a value has been received

  //     var r = await reader.read();
  //     var val = [];
  //     while(!r.done){
  //       val.push(r.value);
  //       r=await reader.read();
  //     }
  // var blob = new Blob(val, { type: 'audio/mpeg' });

  // try {
  //   const fileName = "example1.mp3";
  //   const resData = await res.json();
  //   console.log('ResData: ' + JSON.stringify(resData));
  //   const fileUrl = await saveBlobToFile(JSON.stringify(resData), fileName);
  //   console.log(fileUrl);
  // } catch (error) {
  //   console.log('Save to File Efrror:  ', error.message);
  // }
  let audioData;
  let filePath;
  try {
    audioData = await res.blob();
    console.log('Audio Data: ' + JSON.stringify(audioData));
    filePath = await saveBlobToFile(audioData, 'example.mp3');
    // const fileUrl = await saveBlobToFile(JSON.stringify(audioData), 'example.mp3');
    console.log('Audio Res Data: ' + filePath);
  } catch (error) {
    console.log('Blob Error: ' + error.message);
  }

  // try {
  //   const fileUri = await saveAudioFile(res);
  //   console.log(fileUri); // file URI of the saved audio file
  // } catch (error) {
  //   console.log('Save Audio File Error: ' + error.message);
  // }

  let remote_audio_url;

  try {
    remote_audio_url = await uploadAudioFile(filePath);
    console.log(remote_audio_url);
  } catch (error) {
    console.log('Upload Audio File Error: ' + error.message);
  }

  let talk_id;
  try {
    // generate self intro from image and audio
    talk_id = await createTalk(remote_image_url, remote_audio_url);
    console.log('Talk ID: ' + talk_id);
  } catch (error) {
    console.log('Create Self Video Error: ' + error.message);
  }

  // get result
  var timerId = setInterval(async () => {
    const response = await getTalkById(talk_id);

    if (response.status == 'done') {
      clearInterval(timerId);
      console.log('Response: ' + response);
      console.log('Response URL: ' + response.result_url);
      return response.result_url;
    }
  }, 2000);
}

const saveBlobToFile = async (blobData, filePath) => {
  const dirs = RNFetchBlob.fs.dirs;
  const targetPath = `${dirs.DocumentDir}/${filePath}`;
  try {
    const base64Data = await blobToBase64(blobData);
    await RNFetchBlob.fs.writeFile(targetPath, base64Data, 'base64');
    console.log('Blob file has been written to:', targetPath);
    const fileUrl = `file://${targetPath}`;
    return fileUrl;
  } catch (error) {
    console.log('Error:', error);
  }
};

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
  });
}
