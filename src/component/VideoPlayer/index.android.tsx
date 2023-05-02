// DS: used this as inspiration: https://stackoverflow.com/questions/70660799/how-to-pass-a-ref-to-avoid-reload-react-native-video
import {
  Animated,
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  View,
  FlexStyle,
  AppState,
} from 'react-native';
import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import VideoControls from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import {isNil} from 'lodash';
import {
  getContainerStyle,
  isNoVideo,
  renderEmptyView,
  renderThumbnail,
  showThumbnail,
} from './VideoElements';

const TIMEOUT = 5000;

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
    paused = false,
    uri,
    thumbnail,
  } = prop;

  const [isPaused, setIsPaused] = useState<boolean>(paused);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [vidAspectRatio, setVidAspectRatio] = useState<number>(16 / 9);
  const [hasRefreshed, setHasRefreshed] = useState<boolean>(false);
  const [gcpToken, setGcpToken] = React.useState('');
  const [source, setSource] = React.useState({uri});
  const videoRef = useRef<any>(null);
  const progress = useRef<number>(0);
  const styles = makeStyles({
    vidAspectRatio,
    isFullscreen,
  });

  /**
   * Stop the video from parent component
   */
  useImperativeHandle(ref, () => ({
    handleIsPaused: (parentPaused: boolean) => {
      setIsPaused(parentPaused);
    },
  }));

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

  useEffect(() => {
    if (isFullscreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
    return () => {
      Orientation.lockToPortrait();
    };
  }, [isFullscreen]);

  const handleProgress = (event: any) => {
    progress.current = event.currentTime;
  };

  // TODO: Avoid re-rendering on toggling fullscreen and remove seek hack
  const handleLoad = (res: any) => {
    if (progress.current > 0 && progress.current !== res.currentTime) {
      videoRef.current?.player.ref.seek(progress.current, 300);
    } else {
      videoRef.current?.player.ref.seek(0);
    }
    setVidAspectRatio(
      res?.naturalSize
        ? res.naturalSize.width / res.naturalSize.height
        : 16 / 9,
    );
  };

  // DS: Video onPlay is not fired as we press our own thumbnail button (not the video component)
  const handleUnPausing = (isPausedToggle: boolean) => {
    setIsPaused(isPausedToggle);
    onPlay();
  };

  const togglePause = () => {
    setIsPaused((val: any) => !val);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((val: any) => !val);
    StatusBar.setHidden(!isFullscreen);
  };

  const getVideoStyle = () => {
    if (isFullscreen) {
      return {...getContainerStyle(prop), borderRadius: 0};
    }
    return getContainerStyle(prop);
  };

  /*
      Update source and the gcpToken which is the video key (this forces the video to refresh)
     */
  const _setSource = (gcpAccessToken: string) => {
    const src = {uri};
    if (!isNil(gcpAccessToken)) {
      src.headers = {Authorization: `Bearer ${gcpAccessToken}`};
    }
    setGcpToken(gcpAccessToken || '');
    setSource(src);
  };

  /*
      Assume the bearer token has expired so refresh it.
    */
  const handleError = async (error: any) => {
    console.log({error});
    if (!hasRefreshed) {
      setHasRefreshed(true);
    }
  };

  const renderVideo = () => (
    <Animated.View
      style={[
        styles.container,
        isFullscreen ? styles.containerFSProps : styles.containerProps,
      ]}>
      <View style={styles.videoWrapper}>
        <VideoControls
          key={gcpToken}ƒ
          ref={videoRef}
          source={source}
          disableBack
          muted={false}
          controlTimeout={TIMEOUT}
          style={getVideoStyle()}
          fullscreen={isFullscreen}
          onLoad={handleLoad}
          paused={isPaused}
          onPause={togglePause}
          onEnd={onEnd}
          onProgress={handleProgress}
          onEnterFullscreen={toggleFullscreen}
          onExitFullscreen={toggleFullscreen}
          onError={handleError}
          ignoreSilentSwitch="ignore"
        />
      </View>
    </Animated.View>
  );

  function videoFullscreen() {
    return (
      <Modal
        hardwareAccelerated
        animationType="slide"
        visible={isFullscreen}
        supportedOrientations={['landscape']}>
        <View style={[styles.modalContainer]}>{renderVideo()}</View>
      </Modal>
    );
  }

  const isThumbnailAvailable = showThumbnail(thumbnail, isPaused);
  const isVideoAvailable = !isNoVideo(uri);

  const renderContent = () => {
    if (isThumbnailAvailable) {
      return renderThumbnail(prop, handleUnPausing);
    }
    if (!isThumbnailAvailable && !isVideoAvailable) {
      return renderEmptyView(prop);
    }

    if (isFullscreen) {
      return videoFullscreen();
    }

    return renderVideo();
  };

  return <View style={{margin: margin || 0}}>{renderContent()}</View>;
});
export default VideoPlayer;

// ========== Start Custom Style Sheets =========

const makeStyles = ({vidAspectRatio, isFullscreen}: any) => {
  const dimensions = {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  };

  return StyleSheet.create({
    modalContainer: {
      position: 'relative',
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: '#000',
      resizeMode: 'contain',
      zIndex: -1,
    },
    container: {
      aspectRatio: vidAspectRatio || 1.75,
      maxHeight: isFullscreen ? dimensions.width : dimensions.height,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerProps: {
      resizeMode: 'cover',
    },
    containerFSProps: {
      resizeMode: 'cover',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    videoWrapper: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  });
};
// ========== End Custom Style Sheets =========
