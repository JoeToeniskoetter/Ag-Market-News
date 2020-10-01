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

  const BASE_URI = 'https://www.ams.usda.gov/mnreports/';

  async function getUri(slg: string) {
    setLoading(true)
    let tempUri: string = `${BASE_URI}${slg}.pdf`
    const res = await fetch(tempUri)
    if (res.ok) {
      setUri(tempUri);
      setReportType('pdf');
      setLoading(false);
      setCurrentReportUrl(tempUri);
    } else {
      setUri(`${BASE_URI}${slg}.txt`);
      setReportType('txt');
      setLoading(false);
      setCurrentReportUrl(`${BASE_URI}${slg}.txt`);
    }
  }


  useEffect(() => {
    setUri('');
    getUri(slug_name);
  }, [slug_name])

  if (loading) {
    return <Loading />
  }

  if (reportType === 'txt') {
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
        }}
        onError={(e) => {
          setLoading(false)
          setError(e as any);
          console.log(e);
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
        <ActivityIndicator size="large" color="#000"/>
      </View>
    </View>
  )
}