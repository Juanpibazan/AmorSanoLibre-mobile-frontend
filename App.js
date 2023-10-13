import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo,FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import QuestionScreen from './screens/QuestionScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Home'>
        <Tab.Screen name='Home' component={HomeScreen} options={{tabBarLabel:'Home',tabBarIcon: ()=>(<FontAwesome5 name="home" size={24} color="black" />)}}  />
        <Tab.Screen name='Question' component={QuestionScreen} options={{tabBarLabel:'My Love Pal',tabBarIcon: ()=>(<FontAwesome5 name="hand-holding-heart" size={24} color="black" />)}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
