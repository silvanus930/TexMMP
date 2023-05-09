let ACCESS_TOKEN = "AQV619FLGsai13MliWzBeaed_DK2AvXDF3MNGu_qBqCuyb1HlCRzUD1pSM41d0sKtVVp39Oq93qHQXQV-m44K-Y49bd2A0H9ojWvFolf-S9YT2xfa33GwSBG4yp4nOLWy9tnH-LwgiU-YDKKIJivwDOj4R7n52Hh19fX3rBgoPY6fR_uC1UPadpDPnn7keqpRmKxHU9ZShk-aAiZEKc6zdUHUWkAm1jFJN-xZ_U0dztC0aG30n-QrfIj_yew4BXr27tqQdc-OVl4d65wOMBO7VnbEYDOuJG-bzuC9Yj6IduGxlJPEvafBDDtXwEOLIn8zUQ5RTxVHOo79QtRa9HQ8bofU2uQLg"
let CLIENT_ID = "86cna4jhbvbofu"
let CLIENT_SECRET = "QfT32gc9kOEqI6qG"
// let ACCESS_TOKEN = "AQW0-UKMLxj-MntNqRv-gPkLi5zeBhJsN73CVkATI9OSdI34mdIkSryjyU5XRkFgE-n7vXzEvp-vhKkzNYFt6zUi3Z2jc6dnfveVLzXm7FoTTlsJaIuLatXDRonvVkik2nnfgmD8yCC6TAFqOL5CdX_xDqz97NoibpcEcwU1fG_uh_qTGCGwxlIw2zBezHnnMzSFdVV95In_5HtGvb4oDXx37RgLwoS_Fcb-EoLJKrW0b6Gv_cq83jrLZgHV8ayH0LDdfTSPFi71wnTykNLOdzz7Pj2qAEPzLX3S6h0V7pm5QFTjB2ERQT6Grns1mxZgbiIShtt2ZuuejPD6IQ2RVu2DotsRtA"
// let CLIENT_ID = "86z03rmfrc6npc"
// let CLIENT_SECRET = "Eth5KxaSs0ZXXMYG"


export async function publishToLinkedIn(postContent, videoUrl) {
  let res;
  try {
    res = await registerVideoUpload();
    console.log('Response from register video: ' + res);
  } catch (error) {
    console.log('Register upload error ' + error.message);
  }

  let uploadUrl = res.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
  let assetURN = res.value.asset;
  console.log("uploadUrl, assetURN====>" + uploadUrl + ":" + assetURN)

  let response;
  try {
    response = await uploadVideo(videoUrl, uploadUrl)
  } catch (error) {
    console.log('Video upload error ' + error.message);
  }

  try {
    response = await publishPost(postContent, assetURN)
  } catch (error) {
    console.log('Post publish error ' + error.message);
  }
  return response

}

async function registerVideoUpload() {  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202304'
    },
    body: JSON.stringify({
        "registerUploadRequest": {
            "owner": `urn:li:organization:${CLIENT_ID}`,
            "recipes": [
                "urn:li:digitalmediaRecipe:feedshare-video"
            ],
            "serviceRelationships": [
                {
                    "identifier": "urn:li:userGeneratedContent",
                    "relationshipType": "OWNER"
                }
            ]
        }
    }),
  };
  
  var response = await fetch(`https://api.linkedin.com/rest/assets?action=registerUpload`, requestOptions);
  var result = await response.json();
  return result;
}

async function uploadVideo(videoUrl, uploadVideoUrl) {
    let res;
    try {
        res = await fetch(videoUrl);
    } catch (error) {
        console.log('Get Video error ' + error.message);
    }
    let videoData;
    try {
        videoData = await res.blob();
        console.log('Video Data: ' + JSON.stringify(audioData));
        console.log('Audio Res Data: ' + filePath);
    } catch (error) {
        console.log('Blob Error: ' + error.message);
    }

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: videoData
    };
    
    var response = await fetch(uploadVideoUrl, requestOptions);
    return response;
}

async function publishPost(postContent, videoURN) {
  
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "author": `urn:li:organization:${CLIENT_ID}`,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "media": [
                        {
                            "media": videoURN,
                            "status": "READY"
                        }
                    ],
                    "shareCommentary": {
                        "attributes": [],
                        "text": postContent
                    },
                    "shareMediaCategory": "VIDEO"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }),
    };
    
    var response = await fetch('https://api.linkedin.com/v2/ugcPosts', requestOptions);
    return response;
}
