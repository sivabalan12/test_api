import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Image,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar } from '@rneui/themed';
const DUMMY_URI = 'https://randomuser.me/api/portraits/med/men/75.jpg';
function Home({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [page, setpage] = useState(1);

  const endReached = () => {
    if (isLoading) {
      return;
    }
    setpage(page + 1);
  };

  const renderFooter = () => {
    if (isLoading) return null;
    return (
      <ActivityIndicator
        style={{ color: 'black' }}
      />
    );
  };

  const onRefresh = () => {
    //Clear old data of the list ds
    setData([]);
    //Call the Service to get the latest data
    getData();
  };

  const getData = async () => {
    try {
      const response = await fetch(
        'https://randomuser.me/api/?results=10&seed=abc&page=' + page
      );
      const json = await response.json();
      setRefreshing(false);
      setData([...data, ...json.results]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(getData, [page]);

  return (
    <View style={{ flex: 1 }}>
      {refreshing ? (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
      ) : (
        <FlatList
          data={data}
          onEndReachedThreshold={0}
          onEndReached={endReached}
          ListFooterComponent={renderFooter}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <ListItem
              Component={TouchableHighlight}
              containerStyle={{}}
              disabledStyle={{ opacity: 0.5 }}
              //onLongPress={() => console.log("onLongPress()")}
              onPress={() => navigation.navigate('Details', { item: item })}
              pad={20}
              bottomDivider>
              <Avatar rounded source={{ uri: item.picture.medium }} size={64} />
              <ListItem.Content>
                <ListItem.Title>
                  <Text style={{ fontWeight: 'bold' }}>
                    {item.name.first} {item.name.last}, {item.dob.age}
                  </Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text>Phone: {item.cell}</Text>
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

export const DetailsScreen = ({ route, navigation }) => {
  let item;

  if (route.params) {
    item = route.params.item;
  }

  // const { item='' } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 20, marginBottom: 10, alignSelf: 'center' }}>
        <Avatar
          rounded
          size={100}
          source={{ uri: item?.picture.medium || DUMMY_URI }}
        />
      </View>
      <View style={{ flexDirection: 'column', width: '100%', marginLeft: 20 }}>
        <View style={styles.horizontalline} />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {item?.name.first} {item?.name.last}, {item?.dob.age}
          {'\n'}
        </Text>
        <Text style={{ lineHeight: 24 }}>
          Phone: {item?.cell}
          {'\n'}Email: {item?.email}
          {'\n'}Country: {item?.location.country}
        </Text>
        <View style={styles.horizontalline} />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          Address
          {'\n'}
        </Text>
        <Text style={{ lineHeight: 24 }}>
          Street No: {item?.location.street.number}
          {'\n'}Street Name: {item?.location.street.name}
          {'\n'}City: {item?.location.city}
          {'\n'}State: {item?.location.state}
          {'\n'}Postcode: {item?.location.postcode}
          {'\n'}Timezone: {item?.location.timezone.offset}
        </Text>
      </View>
    </View>
  );
};

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  horizontalline: {
    backgroundColor: 'lightgrey',
    width: '90%',
    height: 1,
    marginVertical: 10,
  },
});

export default App;
