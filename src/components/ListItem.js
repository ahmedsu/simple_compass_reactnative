import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styles from '../styles/style';
import moment from 'moment';

export class ListItem extends Component {
    render() {
        const item = this.props.item;
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemRow}>
                    <Text style={styles.boldText}>Lat: </Text>
                    <Text>{item.lat}</Text>
                </View>
                <View style={styles.itemRow}>
                    <Text style={styles.boldText}>Lat: </Text>
                    <Text>{item.lon}</Text>
                </View>
                <View style={styles.itemRow}>
                    <Text style={styles.boldText}>Date: </Text>
                    <Text>{moment(item.date).format('MMMM Do YYYY, h:mm:ss a')}</Text>    
                </View>
                <View style={styles.itemRow}>
                    <Text style={styles.boldText}>Direction: </Text>
                    <Text>{item.direction}</Text>    
                </View>
            </View>
        )
    }
}

export default ListItem

