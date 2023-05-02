import {DIDAPIKEY} from '../setting';

export async function createTalk(source_url, audio_url) {
  const res = await fetch('https://api.d-id.com/talks', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DIDAPIKEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      script: {
        type: 'audio',
        ssml: 'false',
        reduce_noise: false,
        audio_url: audio_url,
      },
      config: {
        fluent: 'false',
        pad_audio: '0.0',
      },
      source_url: source_url,
      driver_url: 'bank://lively',
    }),
  });
  const result = await res.json();
  return result.id;
}

export async function getTalkById(id) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Basic ${DIDAPIKEY}`,
      'content-type': 'application/json',
    },
  };

  var response = await fetch(`https://api.d-id.com/talks/${id}`, options);
  const result = await response.json();
  return result;
}
