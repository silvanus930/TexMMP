import {ELEVENAPIKEY} from '../setting';

export async function generateAudioWithVoiceAndText(voiceId, text) {
  console.log('Voice Id, Text: ', voiceId, text);
  const requestOptions = {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENAPIKEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.43,
        similarity_boost: 0.28,
      },
    }),
  };
  // Generate audio
  var response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, requestOptions);
  return response;
}

export async function addVoice(formData) {
  var requestOptions = {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENAPIKEY,
      "access-control-allow-headers": "*",
    },
    body: formData,
  };

  const response = await fetch(
    'https://api.elevenlabs.io/v1/voices/add',
    requestOptions,
  );
  const result = await response.json();
  console.log('Eleven Add Voices Response: ' + JSON.stringify(response));
  return result.voice_id;
  // {
  //   "voice_id": "string"
  // }
}
export async function deleteVoice(voice_id) {
  var requestOptions = {
    method: 'DELETE',
    headers: {
      'xi-api-key': ELEVENAPIKEY,
    },
  };

  const response = await fetch(
    `https://api.elevenlabs.io/v1/voices/${voice_id}`,
    requestOptions,
  );
  
  console.log('Eleven Delete Voices Response: ' + response);
  return response;
}