import React, {useState,useEffect} from 'react';
import { View, Text, StyleSheet, Button, StatusBar } from 'react-native';
//import Voice from '@react-native-voice/voice';
import {Audio} from 'expo-av';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000',
        color:'#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        color:'#fff'
    }
});

const QuestionScreen = ()=>{

    const [recording,setRecording] = useState();
    const [updatedRecording,setUpdatedRecording] = useState();
    const [dir, setDir] = useState();

    useEffect(()=>{
        const createDir = async ()=>{
            try {
                const foundDir = await FileSystem.getInfoAsync(FileSystem.cacheDirectory + 'mobile-frontend/');
                if(!foundDir.exists){
                    console.log(FileSystem.cacheDirectory);
                    await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'mobile-frontend/');
                    //console.log(newDir);
                    setDir(FileSystem.cacheDirectory + 'mobile-frontend/');
                } else {
                    console.log('foundDir: ',foundDir);
                    setDir(foundDir.uri);
                }
            } catch(e){
                console.log(e);
            }
        };
        createDir()
    },[])


    const saveToPhone = async (item) => {
        // Remember, here item is a file uri which looks like this. file://..
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.status==='granted') {
          try {
            const asset = await MediaLibrary.createAssetAsync(item);
            MediaLibrary.createAlbumAsync('RecordedAudio', asset, true)
              .then(() => {
                console.log('File Saved Successfully!');
              })
              .catch(() => {
                console.log('Error In Saving File!');
              });
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('Need Storage permission to save file');
        }
      };


    const startRecording = async ()=>{
        try{
            console.log('Requesting permissions...');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS:true,
                playsInSilentModeIOS:true
            });
            console.log('Starting recording...');
            const {recording} = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            /*const {recording} = await Audio.Recording.createAsync({
                isMeteringEnabled: true,
                android: {
                  extension: '.wav',
                  outputFormat: AndroidOutputFormat.PCM,
                  audioEncoder: AndroidAudioEncoder.HE_AAC,
                  sampleRate: 8000,
                  numberOfChannels: 2,
                  bitRate: 16000,
                },
                ios: {
                  extension: '.wav',
                  outputFormat: IOSOutputFormat.WAV,
                  audioQuality: IOSAudioQuality.MAX,
                  sampleRate: 44100,
                  numberOfChannels: 2,
                  bitRate: 128000,
                  linearPCMBitDepth: 16,
                  linearPCMIsBigEndian: false,
                  linearPCMIsFloat: false,
                },
                web: {
                  mimeType: 'audio/webm',
                  bitsPerSecond: 128000,
                },
              });*/
            setRecording(recording);
            console.log('Recording started!');
        }
        catch(err){
            console.error('Failed to start recording: ',err);
        }
    };

    const stopRecording = async ()=>{
        console.log('Stopping Recording...');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const {sound,status} = await recording.createNewLoadedSoundAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at: ', uri);
        try{
            await FileSystem.copyAsync({from:uri,to:`${dir}/recording.m4a`});
        } catch(err){
            console.log('Copy Error: ', err);
            console.log(`this is uri: ${uri} and this is the newDir ${dir}`);
        }
        setUpdatedRecording({
            sound:sound,
            //file:uri
            file:`${dir}/recording.m4a`
        });
        //saveToPhone(uri);
        await Audio.setAudioModeAsync({
            allowsRecordingIOS:false
        });
    };

    const convertToText = async ()=>{
        const file = updatedRecording.file;
        try{
            const {data} = await axios({
                method:'post',
                url:'https://brazilsouth.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=es-BO&format=detailed',
                data: file,
                headers:{
                    'Content-Type': 'audio/wav', 
                    'Ocp-Apim-Subscription-Key': 'b95e028da00a45679305e61c3dbe7237'
                }
            });
            console.log(data.DisplayText);
            } catch(err){
                console.error('Error: ',err);
            }
        }


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Question Screen</Text>
            {!recording ? <Button title='Start Speech To Text' onPress={startRecording} /> : <Button title='Stop Speech to Text' onPress={stopRecording} />}
            <StatusBar style="auto" />
            <Button title='Play' onPress={()=>updatedRecording.sound.replayAsync()} />
            <Button title='Show Text' onPress={convertToText}/>
        </View>
    )
};
export default QuestionScreen;