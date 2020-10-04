import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, Text, Alert, Dimensions } from 'react-native';
import { SearchNavProps } from '../SearchStackParams';
import PDF from 'react-native-pdf';
import WebView from 'react-native-webview';
import { SearchContext } from '../../../Providers/SearchProvider';

interface IPDFView { }

export function PDFView({ navigation, route }: SearchNavProps<"PDFView">) {
  const { setCurrentReportUrl } = useContext(SearchContext);
  const { slug_name } = route.params.report
  const [error, setError] = useState<String | null>(null);
  const [uri, setUri] = useState<string>('');
  const [reportType, setReportType] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  const BASE_URI = `https://ag-market-news.herokuapp.com/report/`;

  async function getUri(slg: string) {
    setLoading(true)
    let tempUri: string = `${BASE_URI}${slg}.pdf`
    try{
    const res = await fetch(tempUri)
    if (res.ok) {
      // Alert.alert('Request okay for: ', tempUri)
      setUri(tempUri);
      setReportType('pdf');
      setLoading(false);
      setCurrentReportUrl(tempUri);
    } else {
      // Alert.alert('Request not okay, setting to: ', `${BASE_URI}${slg}.txt`);
      // Alert.alert(res.statusText);
      setLoading(false);
      setUri(`${BASE_URI}${slg}.txt`);
      setReportType('txt');
      setCurrentReportUrl(`${BASE_URI}${slg}.txt`);
    }
  }catch(e){
    Alert.alert(e.message)
  }
  }


  useEffect(() => {
    setUri('');
    getUri(slug_name);
  }, [slug_name])


  if(loading || uri === ''){
    return <Loading/>
  }
  
  if (reportType === 'txt' || error) {
    return (
      <WebView
      style={{flex:1}}
        source={{ uri }}
      />
    )
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 0,
    }}>
      <PDF
        source={{
          uri
        }}
        trustAllCerts={true}
        
        onError={(e) => {
          setLoading(false)
          setReportType('txt')
        }}

        activityIndicator={<Loading/>}
        onLoadComplete={()=>setLoading(false)}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />
    </View>
  )
}

const Loading: React.FC<{}> = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000"/>
      </View>
    </View>
  )
}