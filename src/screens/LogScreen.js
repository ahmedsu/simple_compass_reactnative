import React, { Component } from 'react'
import { Text, View, Button, FlatList, Picker } from 'react-native'
import store from 'react-native-simple-store';
import ListItem from '../components/ListItem';

export class LogScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      pickerVal: 'ALL'
    }
  }

  componentDidMount(){

    this.getData();
  }

  getData = () => {
    store.get('historyData')
    .then((res) => this.setState({data: res}))
    .catch((err) => console.log(err));
  }


    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{fontSize: 17, marginTop: 10}}>Location History</Text>
          
          <Picker
            selectedValue={this.state.pickerVal}
            style={{height: 50, width: 100}}
            itemStyle={{height: 65}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({pickerVal: itemValue})
            }>
            <Picker.Item label="All" value="ALL" />
            <Picker.Item label="North" value="N" />
            <Picker.Item label="East" value="E" />
            <Picker.Item label="South" value="S" />
            <Picker.Item label="West" value="W" />
            <Picker.Item label="North East" value="NE" />
            <Picker.Item label="South East" value="SE" />
            <Picker.Item label="South West" value="SW" />
            <Picker.Item label="North West" value="NW" />
          </Picker>

          <FlatList
            data={this.state.data}
            style={{width:'95%'}}
            renderItem={({item}) => 
            this.state.pickerVal == 'ALL' ?
            (
              <ListItem item={item}></ListItem>
            ) : item.direction == this.state.pickerVal ?
              <ListItem item={item}></ListItem>
              :
              null
            }
            keyExtractor={(item, index) => index.toString()}
          >
          </FlatList>

          <View style={{marginBottom: 30}}>
            <Button
              title="Go back"
              onPress={() => this.props.navigation.goBack()}
            />
          </View>

        </View>
      );
    }
  }

export default LogScreen
