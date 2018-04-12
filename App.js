import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Zeroconf from 'react-native-zeroconf'

export default class App extends React.Component {

  state = {
    hasPrinter : '',
    printerDetail : ''
  }

  componentDidMount() {
    this.findPrinter()
  }

  findPrinter = () => {

    this._zeroconf = new Zeroconf()
    this._zeroconf.scan(type = 'ipp', protocol = 'tcp')

    this._zeroconf.on('update', () => {

      let getIPP = this._zeroconf.getServices()
      //console.log(getIPP)
      let getIPPname = Object.keys(getIPP);
      let array = [];

      getIPPname.map((name) => {

        let info = getIPP[name]

        if (info['port'] != null) {

          let info_ = {
            name: info['name'],
            UUID: info['txt']['UUID'],
            model: info['txt']['ty'],
            status: info['txt']['printer-state'],
            ip: info['addresses'][0],
            port: info['port'],
            path: info['txt']['rp'],
            host: info['host']
          }
          
          return array.push(info_)

        } else {

          return null

        }

      })

      this.setState({ printerDetail: array, hasPrinter: '1' })

    });
  }

  

  render() {
    //console.log(this.state.printerDetail)
    return (
      <View style={styles.container}> 
        {
          this.state.hasPrinter != ''
          ? 
            this.state.printerDetail.map( (data,i) => {
              return <Text key={i}>{data.name + ' ' + data.ip + ' ' + data.port}</Text>
            })
          : <Text>not found printer in ipp protocol!</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
