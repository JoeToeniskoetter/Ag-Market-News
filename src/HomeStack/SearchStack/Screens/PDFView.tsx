import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, Text, Alert, Dimensions } from 'react-native';
import { SearchNavProps } from '../SearchStackParams';
import PDF from 'react-native-pdf';
import WebView from 'react-native-webview';
import { SearchContext } from '../../../Providers/SearchProvider';
import { FirebaseAuthProviderContext } from '../../../Providers/FirebaseAuthProvider';
import { BASE_URI } from '../../../shared/util';

interface IPDFView { }

export function PDFView({ navigation, route }: SearchNavProps<"PDFView">) {
  const { setCurrentReportUrl } = useContext(SearchContext);
  const { state: { user } } = useContext(FirebaseAuthProviderContext);
  const { slug_name, slug_id } = route.params.report
  const [error, setError] = useState<String | null>(null);
  const [uri, setUri] = useState<string>('');
  const [reportType, setReportType] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  async function getUri(slg: Number) {
    setLoading(true)
    let tempUri: string = `${BASE_URI}/reportLink?id=_${slg}`
    try {
      const res = await fetch(tempUri, {
        headers: {
          Authorization: `Bearer ${await user?.getIdToken()}`
        }
      })
      console.log(res.status)
      if (res.ok) {
        const json = await res.json();
        if (json.link) {
          setUri(json.link);
          setReportType(String(json.link).includes('.pdf') ? 'pdf' : 'txt');
          setLoading(false);
          setCurrentReportUrl(json.link);
        }
      } else {
        setLoading(false);
        console.log(res.status)
      }
    } catch (e) {
      Alert.alert(e.message)
    }
  }


  useEffect(() => {
    setUri('');
    getUri(slug_id);
  }, [slug_name])


  if (loading || uri === '') {
    return <Loading />
  }

  if (reportType === 'txt' || error) {
    return (
      <WebView
        style={{ flex: 1 }}
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

        activityIndicator={<Loading />}
        onLoadComplete={() => setLoading(false)}
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
        <ActivityIndicator size="large" color="#000" />
      </View>
    </View>
  )
}