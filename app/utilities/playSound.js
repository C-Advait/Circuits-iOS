import Sound from 'react-native-sound';

export default function playSound(soundAsset) {
    const sound = new Sound(soundAsset, (error) => {
        if (error) {
        console.log('Error loading sound: ', error);
        return;
        }
        // Play the sound
        sound.play((success) => {
        if (success) {
            null;
        } else {
            console.log('Playback failed');
        }
        // Release the audio file resource
        sound.release();
        });
    });
};