import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#2799CF',
        alignItems:'center',
        paddingVertical: 20
    },
    
    //LIST ITEM STYLE
    itemContainer: {
        width: '100%',
        paddingHorizontal: 0,
        paddingVertical: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flexDirection:'column',
        justifyContent:'space-between'
    },
    itemRow: {
        flexDirection:'row',
        paddingVertical: 5,
    },
    boldText: {
        fontWeight:'bold'
    }
});