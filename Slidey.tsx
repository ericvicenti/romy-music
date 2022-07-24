import React, { Component } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const COLLAPSED_PLAYER_HEIGHT = 100;
const GESTURE_THRESHOLD_RATIO = 0.3;
const ART_TOP_OFFSET = 60;

export default function Slidey() {
  const isCollapsed = useSharedValue(true);
  const { height: screenHeight, width: screenWidth } = useSafeAreaFrame();
  const { top: topAreaInset } = useSafeAreaInsets();
  const playerVerticalPosition = useSharedValue(0);
  const openPlayerHeight = screenHeight - topAreaInset;
  const openPlayerPosition = openPlayerHeight - COLLAPSED_PLAYER_HEIGHT;
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (isCollapsed.value) {
        if (e.translationY < 0) {
          playerVerticalPosition.value = -e.translationY;
        }
      } else {
        playerVerticalPosition.value = -e.translationY + openPlayerPosition;
      }
    })
    .onEnd((e) => {
      if (
        isCollapsed.value
          ? playerVerticalPosition.value >
            openPlayerHeight * GESTURE_THRESHOLD_RATIO
          : playerVerticalPosition.value >
            openPlayerHeight * (1 - GESTURE_THRESHOLD_RATIO)
      ) {
        playerVerticalPosition.value = withTiming(openPlayerPosition, {
          duration: 100,
        });
        isCollapsed.value = false;
      } else {
        playerVerticalPosition.value = withTiming(0, { duration: 100 });
        isCollapsed.value = true;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          openPlayerHeight -
          COLLAPSED_PLAYER_HEIGHT -
          playerVerticalPosition.value,
      },
    ],
  }));

  const openRatio = useDerivedValue(() => {
    return playerVerticalPosition.value / openPlayerPosition;
  }, [playerVerticalPosition, openPlayerPosition]);

  const albumTitleStyle = useAnimatedStyle(() => ({
    opacity: openRatio.value,
  }));

  const albumArtStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          openRatio.value,
          [0, 1],
          [-(screenWidth - COLLAPSED_PLAYER_HEIGHT) / 2, 0]
        ),
      },
      {
        translateY: interpolate(
          openRatio.value,
          [0, 1],
          [-ART_TOP_OFFSET - screenWidth / 2 + COLLAPSED_PLAYER_HEIGHT / 2, 0]
        ),
      },
      {
        scale: interpolate(
          openRatio.value,
          [0, 1],
          [COLLAPSED_PLAYER_HEIGHT / screenWidth, 1]
        ),
      },
    ],
  }));

  return (
    <>
      <View style={{ flex: 1, opacity: 0 }}></View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              height: screenHeight - topAreaInset,
              backgroundColor: "white",
              borderRadius: 8,
              shadowColor: "#00000088",
              shadowRadius: 3,
              shadowOpacity: 0.3,
            },
            animatedStyle,
          ]}
        >
          <Animated.Text
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                color: "#e14157",
                textAlign: "center",
                fontSize: 28,
                paddingVertical: 16,
              },
              albumTitleStyle,
            ]}
          >
            Podcast / Album Name
          </Animated.Text>
          <Animated.View
            style={[
              {
                marginTop: ART_TOP_OFFSET,
                flexDirection: "column",
                justifyContent: "center",
                padding: 40,
              },
              albumArtStyle,
            ]}
          >
            <View
              style={{
                backgroundColor: "blue",
                aspectRatio: 1,
                borderRadius: 6,
                alignSelf: "stretch",
              }}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}
