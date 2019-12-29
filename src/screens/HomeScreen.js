import React, { Component } from 'react'
import { Text, View, Button, Dimensions, Image, Animated, Easing, Platform} from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import { Grid, Col, Row } from 'react-native-easy-grid';
import store from 'react-native-simple-store';

const {height, width} = Dimensions.get("window");

export class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lastPoint: null,
      bearingAngle: 0,
      lastBearingAngle: 0
    }
  }

  componentDidMount(){
    // Stored data is resetting each time we enter into the app because app should start logging locations only if it is open
    // COMMENT THIS OUT TO HAVE PERSISTANCE
    store.delete("historyData");

    // We are tracking location change with this instance
     Geolocation.watchPosition((newPos) => {
      //console.log("New position: ");
      //console.log(newPos);
      let _bearingAngle = null;

      let currentPoint = { // this will be our current point object
        lat: newPos.coords.latitude, 
        long: newPos.coords.longitude,
        timestamp: newPos.timestamp
      }

      if(this.state.lastPoint == null){
        //this.setState({lastPoint: currentPoint});
       // _bearingAngle = this.calcBearingAngle(currentPoint, currentPoint);
        this.setState({lastPoint: currentPoint, bearingAngle: 0});
      } else {
        _bearingAngle = this.calcBearingAngle(this.state.lastPoint, currentPoint);
        const _direction = this.getDirection(this.repositionDeg(_bearingAngle));
        this.setState({lastPoint: currentPoint, bearingAngle: _bearingAngle}, () => {
          const date = Date();
          const obj = {
            'date': date,
            'timestamp': currentPoint.timestamp,
            'lat': currentPoint.lat,
            'lon': currentPoint.long,
            'direction': _direction
          }
          //console.log("OBJ: ", obj);
          this.storeData(obj);
        });
      }
    },
    (err) => {
      //console.log("ERROR: ");
      console.log(err);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 50 // new position will be recorded after each 50m
    }
    )
  }

  // Store data to storage
  storeData = (obj) => {
    store.push('historyData', obj);
  }

  // Converting degrees to radians
  degToRad = (deg) => {
    let pi = Math.PI;
    return deg * (pi/180);
  }

  // Converting radians to degrees
  radToDeg = (rad) => {
    let pi = Math.PI;
    return rad * (180/pi);
  }

  // Calculating bearing angle between two points (A -> B)
  calcBearingAngle = (lastPoint, currentPoint) => {
    /*console.log("LAST POINT: ");
    console.log(lastPoint);
    console.log("CURRENT POINT: ");
    console.log(currentPoint);*/

    const latA = lastPoint.lat;
    const longA = lastPoint.long;
    
    const latB =  currentPoint.lat;
    const longB = currentPoint.long;

    const L = (longA - longB)*(-1); // difference between longitudes

    const sinL = Math.sin(this.degToRad(L));
    const cosL = Math.cos(this.degToRad(L));

    /*console.log("L: ", L);
    console.log("SIN L: ", sinL);
    console.log("COS LAT B: ", Math.cos(this.degToRad(latB)));*/

    // first we need to calculate X and Y points from our coordinates
    const x = Math.cos(this.degToRad(latB)) * sinL;
    const y = (Math.cos(this.degToRad(latA)) * Math.sin(this.degToRad(latB))) - (Math.sin(this.degToRad(latA)) * Math.cos(this.degToRad(latB)) * cosL);

    const _bearingAngle = this.radToDeg(Math.atan2(x,y)); // X-ose and Y-ose are inverted, so we don't need to use custom function for inverting angles

    return Math.round(_bearingAngle);
  }


  // Converting angle to the actual direction
  getDirection = (deg) => {
    //console.log("DEG: ", deg);
    if(deg >= 22.5 && deg < 67.5){
      return "NE";
    } else if(deg >= 67.5 && deg < 112.5){
      return "E";
    } else if(deg >= 112.5 && deg < 157.5){
      return "SE";
    } else if(deg >= 157.5 && deg < 202.5){
      return "S";
    } else if(deg >= 202.5 && deg < 247.5){
      return "SW";
    } else if(deg >= 247.5 && deg < 292.5){
      return "W";
    } else if(deg >= 292.5 && deg < 337.5){
      return "NW"
    } else {
      return "N";
    }
  }

  // We are using this function to convert negative angle to positive

  repositionDeg = (deg) => {
    return deg >= 0 ? deg : deg + 360;
  }


    render() {
      let spinVal = new Animated.Value(0);

      Animated.timing(
        spinVal,
      {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear
      }
      ).start()


      const spin = spinVal.interpolate({
        inputRange: [0, 1],
        outputRange: [`${this.repositionDeg(this.state.bearingAngle) + "deg"}`, `${360 - this.repositionDeg(this.state.bearingAngle) + "deg"}`]
      })

      return (
        <Grid>
          <Row style={{alignItems:'center'}} size={0.9}>
            <Col style={{alignItems: "center"}}>
            <Text style={{
                color: 'black',
                fontSize: 18,
                fontWeight:'bold'
              }}>
                Latitude: {this.state.lastPoint != null ? this.state.lastPoint.lat : 'Loading'}
              </Text>
              <Text style={{
                color: 'black',
                fontSize: 18,
                fontWeight:'bold'
              }}>
                Longitude: {this.state.lastPoint != null ? this.state.lastPoint.long : 'Loading'}
              </Text>
              <Text style={{
                color: 'black',
                fontSize: 18,
                fontWeight:'bold'
              }}>
                Direction: {this.getDirection(this.repositionDeg(this.state.bearingAngle))}
              </Text>
            </Col>
          </Row>

          <Row style={[{alignItems:'center'}, Platform.OS == 'android' ? {paddingVertical: 25} : {paddingVertical: 5}]} size={0.1}>
            <Col style={{alignItems:'center'}}>
              <View style={{width: width, alignItems: 'center', bottom: 0}}>
                <Image source={require('../assets/compass_pointer.png')} 
                  style={{
                    height: height / 26,
                    resizeMode: 'contain',
                  }}></Image>
              </View>
            </Col>
          </Row>

          <Row style={{alignItems:'center'}} size={2}>
              <Col style={{alignItems:'center'}}>
                  <Animated.Image
                  style={{
                    height: width - 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    resizeMode: 'contain',
                    transform: [{rotate: spin}] 
                  }}
                  source={require('../assets/compass_rose_blue.png')} />
              </Col>
          </Row>

          <Row style={{alignItems:'center'}} size={1}>
            <Col style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: height / 27,
                  width: width,
                  position: 'absolute',
                  textAlign: 'center'
                }}
                >
                  {this.repositionDeg(this.state.bearingAngle)}°
                </Text>
                <View style={{marginTop: 40}}>
                  <Button
                    title="Show History"
                    onPress={() => this.props.navigation.navigate('Details')}
                  />
                </View>
            </Col>
          </Row>
        </Grid>
          
         
      );
    }
}


export default HomeScreen

