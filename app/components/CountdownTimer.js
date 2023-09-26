import React, {useState, useEffect} from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';


function decrement() {

}

function CountdownTimer({length}) {

    const [seconds, setSeconds] = useState(length); //Start at the top, as we want a count-down timer
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;

        if (seconds > 0 && isRunning) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1)
            }, 1000);
        }

        return (() => {
            clearInterval(interval);
        });

    }, [isRunning, seconds])

    return (
        <View style={styles.container}>
            <Text style={styles.timeDisplay}>{seconds}</Text>
            <Button 
            title='Start'
            onPress={() => setIsRunning(true)}/>
            <Button 
            title='Stop'
            onPress={() => setIsRunning(false)}/>
            <Button 
            title='Reset'
            onPress={() => {
                setIsRunning(false);
                setSeconds(length);
                }
            }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeDisplay: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 50
    }
})

export default CountdownTimer;