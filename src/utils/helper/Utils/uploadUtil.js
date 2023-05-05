import RNFS from 'react-native-fs';
import {UPLOAD_API_KEY} from '../setting';

export const uploadImageFile = async local_file_path => {
  try {
    console.log('Uploading file: ' + local_file_path);
    const extension = 'image/jpg';
    console.log('Extension: ' + extension);
    const formData = new FormData();
    formData.append('file', {
      uri: local_file_path,
      name: 'temp.jpg',
      type: extension,
    });
    console.log('Form data: ' + JSON.stringify(formData));
    const response = await fetch(
      'https://api.upload.io/v2/accounts/W142hqB/uploads/form_data',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPLOAD_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      },
    );
    const result = await response.json();
    console.log('Image Uploading result: ' + JSON.stringify(result));
    return result.files[0].fileUrl;
  } catch (error) {
    console.log('Upload error: ' + error.message);
  }
};
export const uploadAudioFile = async local_file_path => {
  try {
    console.log('Uploading file: ' + local_file_path);
    const extension = 'mpeg/audio';
    console.log('Extension: ' + extension);
    const formData = new FormData();
    formData.append('file', {
      uri: local_file_path,
      name: local_file_path.split('/').pop(),
      type: extension,
    });
    const response = await fetch(
      'https://api.upload.io/v2/accounts/W142hqB/uploads/form_data',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPLOAD_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      },
    );
    const result = await response.json();
    console.log('Audio Uploading result: ' + JSON.stringify(result));
    return result.files[0].fileUrl;
  } catch (error) {
    console.log('Upload error: ' + error.message);
  }
};
