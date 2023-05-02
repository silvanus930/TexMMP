import {Dimensions, Platform, Pressable, StyleSheet, View} from 'react-native';
import React, {ReactNode} from 'react';
import {MaterialCommunityIcon} from 'res/icons';
import FastImage from 'react-native-fast-image';

export const getHeight = (height?: number) => {
  const MIN_HEIGHT = 220;
  const factor = Platform.OS === 'android' ? 0.26 : 0.285;
  const dynamicHeight = height || Dimensions.get('window').height * factor;
  return dynamicHeight >= MIN_HEIGHT ? dynamicHeight : MIN_HEIGHT;
};

export const getContainerStyle = (prop: any) => {
  const {borderRadius, borderBottomRadius, height} = prop;
  return {
    width: '100%',
    height: getHeight(height),
    borderRadius: borderRadius || 0,
    borderBottomLeftRadius: borderBottomRadius || borderRadius || 0,
    borderBottomRightRadius: borderBottomRadius || borderRadius || 0,
  };
};

/**
 * Check if thumbnail should be displayed or not
 * @param { string | null | undefined} thumbnail The thumbnail uri string
 * @param { boolean} isVideoPaused Whether video is paused or not
 * @return { boolean }
 */
export const showThumbnail = (
  thumbnail: string | null | undefined,
  isVideoPaused: boolean,
): boolean => Boolean(thumbnail && isVideoPaused);

/**
 * Check if video uri is exists or not
 * @param { string | null | undefined } uri Video uri string
 * @return { boolean }
 */
export const isNoVideo = (uri: string | null | undefined): boolean => !uri;

/**
 * Return empty black box for non-video elements
 * @param { any } cStyles The styles for empty-view
 * @return { ReactNode }
 */
export const renderEmptyView = (prop: any): ReactNode => {
  const {margin} = prop;
  return (
    <View style={{margin: margin || 0}}>
      <View style={[styles.black, {...getContainerStyle(prop)}]} />
    </View>
  );
};

export const renderThumbnail = (prop: any, setIsPaused: any) => {
  const {uri, thumbnail} = prop;
  const isVideoAvailable = !isNoVideo(uri);
  return (
    <Pressable
      onPress={() => {
        if (isVideoAvailable) {
          setIsPaused(false);
        }
      }}
      style={[styles.black, {...getContainerStyle(prop)}]}>
      <FastImage
        resizeMode="cover"
        source={{
          uri: thumbnail,
        }}
        style={{...getContainerStyle(prop)}}
      />
      {isVideoAvailable && (
        <View style={[styles.centre]}>
          <MaterialCommunityIcon name="play-circle" size={70} color="#fff" />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  black: {
    backgroundColor: '#000',
  },
  centre: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
