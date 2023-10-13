import React from 'react';
import { StyleSheet,View,Text, Button } from 'react-native';

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
})

const HomeScreen =({navigation})=>{


    return (
        <View style={styles.container}>
            <View >
                <Text style={styles.text}>Home Screen</Text>
                <Button title='Prueba nuestro consejero especializado en relaciones de pareja' onPress={()=>navigation.navigate('Question')} />
            </View>

        </View>
    )
};

export default HomeScreen;