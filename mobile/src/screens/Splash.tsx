import { StyleSheet } from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { useState, useEffect } from "react";
import { hideAsync } from 'expo-splash-screen';

type Props = {
    onComplete: (status: boolean) => void;
}

export function Splash({ onComplete }: Props) {
    const [lastStatus, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);

    function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
        if (status.isLoaded) {
            if (lastStatus.isLoaded !== status.isLoaded) {
                hideAsync();
            }

            if (status.didJustFinish) {
                onComplete(true);
            }
            setStatus(status); // Atualize o estado aqui
        }
    }

    return (
        <Video
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            source={require('../../assets/images/splash.mp4')}
            isLooping={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            shouldPlay
        />
    );
}
