import RNFetchBlob from 'rn-fetch-blob';

import { createTalk, getTalkById } from './DID/did';
import { generateAudioWithVoiceAndText, addVoice, deleteVoice } from './elevenlab/elevenlab';
import { uploadImageFile, uploadAudioFile } from './Utils/uploadUtil';

export async function createSelfIntroVideo(
  local_image_url,
  local_text,
  local_audio_url,
  setCurrentPosition,
) {

  let position = 0;
  console.log('Image URL: ' + local_image_url);
  console.log('Text: ' + local_text);
  console.log('Audio URL: ' + local_audio_url);
  // upload image to online store

  let remote_image_url = local_image_url;

/// ================== Image upload ====================
setCurrentPosition(++position);
/// =====================================================

  // add voice
  var formdata = new FormData();
  formdata.append('name', 'voice');
  formdata.append('files', 
    {
      uri: local_audio_url,
      name: local_audio_url.split('/').pop(),
      type: 'audio/mpeg',
    },
  );

  console.log('Form file data', {
    uri: local_audio_url,
    name: local_audio_url.split('/').pop(),
    type: 'audio/mpeg',
  });

  // let voice_id = 'W2TeetKrcgLVT9WkK3nK';
  let voice_id;
  try {
    voice_id = await addVoice(formdata);
    console.log('VoiceID for Eleventh: ' + voice_id);
    if (!voice_id) return;
  } catch (error) {
    console.log('Voice for Eleven Error: ' + error.message);
    return;
  }

  // generate audio with voice id and text
  let res;
  let audioData;
  let filePath;
  try {
    res = await generateAudioWithVoiceAndText(voice_id, local_text);
    // audio stream to storage 
    try {
      audioData = await res.blob();
      console.log('Audio Data: ' + JSON.stringify(audioData));
      filePath = await saveBlobToFile(audioData, 'example.mp3');
      console.log('Audio File Data: ' + filePath);

      // remove voice id when create audio from text then save local storage
      try {
        const voiceIDRemoveResult = await deleteVoice(voice_id);
        console.log('VoiceID Deleted: ', voice_id, voiceIDRemoveResult);
      } catch (error) {
        console.log('VoiceID Deletion Error: ' + error.message);
        return;
      }

      if (!filePath) return;
    } catch (error) {
      console.log('Blob Error: ' + error.message);
      return;
    }
    console.log('Response from VoiceID: ' + res);
  } catch (error) {
    console.log('Text for Voice Error: ' + error.message);
    return;
  }

  /// ================== Audio To Text ====================
  setCurrentPosition(++position);
  /// =====================================================

  let remote_audio_url;

  try {
    remote_audio_url = await uploadAudioFile(filePath);
    console.log(remote_audio_url);
    if (!remote_audio_url) return;
  } catch (error) {
    console.log('Upload Audio File Error: ' + error.message);
    return;
  }

  /// ================== Audio Upload ====================
  setCurrentPosition(++position);
  /// ========================================

  let talk_id;
  try {
    // generate self intro from image and audio
    talk_id = await createTalk(remote_image_url, remote_audio_url);
    console.log('Talk ID: ' + talk_id);
    if (!talk_id) return;
  } catch (error) {
    console.log('Create Self Video Error: ' + error.message);
    return;
  }

  // getting result
  let response = await waitForTalkResult(talk_id);
  console.log('Returing Response URL: ' + response);

  /// ================== Generate Video ====================
  setCurrentPosition(++position);
  /// ========================================
  return response;
}

function waitForTalkResult(talk_id) {
  return new Promise(async (resolve, reject) => {
    const maxWaitingTime = 30 * 1000; // 30 seconds
    let elapsedTime = 0;

    const timerId = setInterval(async () => {
      try {
        const response = await getTalkById(talk_id);
        console.log('elapted Time: ', elapsedTime);
        if (response.status === 'done') {
          clearInterval(timerId);
          console.log('Response URL:', response.result_url);
          resolve(response.result_url);
        }
      } catch (error) {
        clearInterval(timerId);
        reject(error);
      }

      elapsedTime += 2000; // Interval is set to 2000 milliseconds (2 seconds)
      if (elapsedTime >= maxWaitingTime) {
        clearInterval(timerId);
        reject(new Error('Maximum waiting time exceeded. Seems like network issue. Please try again later.'));
      }
    }, 2000);
  });
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
