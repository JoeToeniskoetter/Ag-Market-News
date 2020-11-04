import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { MyReportsNavProps } from '../MyReportsStackParams';
import PDF from 'react-native-pdf';
import WebView from 'react-native-webview';


export function PDFView({ navigation, route }: MyReportsNavProps<"PDFView">) {
  const { slug_name, report_title, report_url } = route.params.report;
  const [error, setError] = useState<String | null>(null);
  const [uri, setUri] = useState<string>('');
  const [reportType, setReportType] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const BASE_URI = 'https://joetoeniskoetter.com/api/ag-market-news/report/';

  async function getUri(slg: string) {
    setLoading(true)
    let tempUri: string = `${BASE_URI}${slg}.pdf`
    const res = await fetch(tempUri)
    try {
      if (res.ok) {
        setUri(tempUri);
        setReportType('pdf');
        setLoading(false);
      } else {
        setUri(`${BASE_URI}${slg}.txt`);
        setReportType('txt');
        setLoading(false);
      }
    } catch (e) {
      Alert.alert(e.message)
    }
  }

  useEffect(() => {
    if (report_url) {
      console.log(report_url)
      setUri(report_url);
    } else {
      setUri('');
      getUri(slug_name);
    }
  }, [slug_name])

  if (loading || uri === '') {
    return <Loading />
  }

  if (reportType === 'txt' || error) {
    return (
      <WebView
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
          uri,
          cache: false
        }}
        trustAllCerts={true}
        activityIndicator={<Loading />}
        onError={(e) => {
          setLoading(false)
          setError(e as any)
        }}
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
    <View style={{ position: 'absolute', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000ff" animating={true} />
      </View>
    </View>
  )
}