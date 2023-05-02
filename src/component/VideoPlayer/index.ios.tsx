import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  AppState,
  View,
  FlexStyle,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Video, {OnPlaybackRateData} from 'react-native-video';
import R from 'res/R';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getContainerStyle,
  isNoVideo,
  renderEmptyView,
  renderThumbnail,
  showThumbnail,
} from './VideoElements';

interface VideoPlayerProps {
  onPlay?: () => void;
  onEnd?: () => void;
  paused?: boolean;
  uri: string | null;
  thumbnail: string | null;
}

const VideoPlayer = forwardRef((prop: VideoPlayerProps & FlexStyle, ref) => {
  const {
    margin = 0,
    onPlay = () => {},
    onEnd = () => {},
    paused = true,
    uri,
    thumbnail,
  } = prop;

  const [isPaused, setIsPaused] = useState<boolean>(paused);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [hasRefreshed, setHasRefreshed] = useState<boolean>(false);
  const [isWatched, setIsWatched] = React.useState(false);
  const [gcpToken, setGcpToken] = React.useState('');
  const primaryRef = useRef<Video>(null);
  /**
   * Stop the video from parent component
   */
  useImperativeHandle(ref, () => ({
    handleIsPaused: (parentPaused: boolean) => {
      setIsPaused(parentPaused);
    },
  }));

  useEffect(() => {
    (async function () {
      const storedGCPToken = await AsyncStorage.getItem('gcpToken');
      setGcpToken(storedGCPToken || '');
    })();
  }, []);
  /**
   * Stop the video if the app is in background mode
   * @dev Ensure backgrounding/reopening does not autoplay video
   */
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      currentState => {
        if (currentState === 'background') {
          setIsPaused(true);
        }
      },
    );

    return () => {
      appStateListener?.remove();
      setIsPaused(true);
    };
  }, []);

  const isThumbnailAvailable = showThumbnail(thumbnail, isPaused);
  const isVideoAvailable = !isNoVideo(uri);

  const handlePlay = (data: OnPlaybackRateData) => {
    if (!isWatched && data.playbackRate === 1) {
      onPlay();
      setIsWatched(true);
    }
  };

  /*
      Assume the bearer token has expired so refresh it (once)
    */
  const handleError = async (error: any) => {
    console.log({error});
    if (!hasRefreshed) {
      setHasRefreshed(true);
    }
  };

  const handleReady = () => {
    setIsReady(true);
  };

  const renderContent = () => {
    if (isThumbnailAvailable) {
      return renderThumbnail(prop, setIsPaused);
    }
    if (!isThumbnailAvailable && !isVideoAvailable) {
      return renderEmptyView(prop);
    }
    return (
      <>
        <Video
          key={gcpToken}
          initialNumToRender={0}
          removeClippedSubviews
          maxToRenderPerBatch={1}
          windowSize={4}
          ref={primaryRef}
          source={{
            uri: String(uri),
            headers: {
              Authorization: `Bearer ${gcpToken}`,
            },
          }}
          resizeMode="cover"
          style={getContainerStyle(prop)}
          controls
          paused={isPaused}
          onPlaybackRateChange={handlePlay}
          onEnd={onEnd}
          onError={handleError}
          onReadyForDisplay={handleReady}
          ignoreSilentSwitch="ignore"
        />
        {!isReady && (
          <ActivityIndicator
            animating
            color="white"
            size="large"
            style={styles.spinner}
          />
        )}
      </>
    );
  };
  return <View style={{margin}}>{renderContent()}</View>;
});

export default VideoPlayer;

// ========== Start Custom Style Sheets =========
const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: R.colours.dark,
  },
});

// ========== End Custom Style Sheets =========
