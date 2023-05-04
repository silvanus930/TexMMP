import React, { useCallback, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import View from 'react-native-ui-lib/view';
import Text from 'react-native-ui-lib/text';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import GradientView from 'component/GradientView';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageSequence from 'react-native-image-sequence-2';

const StartScreen = () => {
  const carouselRef = useRef(null);
  const size = Dimensions.get('window').width;
  const [position, setPosition] = useState(0);
  const navigation = useNavigation<any>();

  const _renderItem = useCallback(
    (item: any) => (
      <View>
        <Text body white marginH-40 style={{ fontSize: 34, fontWeight: '700' }}>
          {item.item.title}
        </Text>
        <Text body white marginH-40 style={{ fontSize: 22, fontWeight: '400' }}>
          {item.item.text}
        </Text>
      </View>
    ),
    [],
  );
  const data = [
    {
      title: 'Welcome to TexMMP',
      text: 'Where we are transform your text into video using AI!',
    },
    {
      title: 'Just Upload one image',
      text: 'Getting Fantastic AI video....',
    },
    {
      title: "Let's Go",
      text: 'Building a new world with TexMMP',
    },
  ];
  const imageSources = [
    require('res/images/bot/0001.png'),
    require('res/images/bot/0002.png'),
    require('res/images/bot/0003.png'),
    require('res/images/bot/0004.png'),
    require('res/images/bot/0005.png'),
    require('res/images/bot/0006.png'),
    require('res/images/bot/0007.png'),
    require('res/images/bot/0008.png'),
    require('res/images/bot/0009.png'),
    require('res/images/bot/0010.png'),
    require('res/images/bot/0011.png'),
    require('res/images/bot/0012.png'),
    require('res/images/bot/0013.png'),
    require('res/images/bot/0014.png'),
    require('res/images/bot/0015.png'),
    require('res/images/bot/0016.png'),
    require('res/images/bot/0017.png'),
    require('res/images/bot/0018.png'),
    require('res/images/bot/0019.png'),
    require('res/images/bot/0020.png'),
    require('res/images/bot/0021.png'),
  ];

  return (
    <GradientView style={{ flex: 1 }}>
      <ImageSequence
        images={imageSources}
        startFrameIndex={0}
        style={{ flex: 1.5, marginTop: 50 }}
      />
      {/* <FastImage
        resizeMode="contain"
        style={[{ flex: 2 }, imageStyle]}
        source={imageSources[index.value]}
      /> */}
      <View flex>
        <View>
          <Carousel
            data={data}
            ref={carouselRef}
            renderItem={_renderItem}
            sliderWidth={size}
            itemWidth={size}
            onSnapToItem={(itemIndex: number) => setPosition(itemIndex)}
          />
        </View>
        <View marginL-10 row style={{ alignItems: 'space-between' }}>
          <Pagination
            dotsLength={3}
            activeDotIndex={position}
            carouselRef={carouselRef}
            dotStyle={{
              width: 30,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'white',
            }}
            inactiveDotStyle={{ width: 10 }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1}
            tappableDots
          />
          <View flex marginR-20 style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                width: 60,
                height: 60,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                console.log(position);
                if (position < 2) {
                  carouselRef.current.snapToItem(position + 1);
                } else {
                  navigation.navigate('HomeScreen');
                }
              }}>
              <IoniconsIcon
                name="md-arrow-forward-sharp"
                size={30}
                color="#02BE9A"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GradientView>
  );
};

export default StartScreen;
