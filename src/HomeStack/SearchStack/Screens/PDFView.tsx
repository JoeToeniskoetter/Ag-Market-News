import React, {useEffect, useState} from 'react';
import {View, Alert, Dimensions} from 'react-native';
import {SearchNavProps} from '../SearchStackParams';
import PDF from 'react-native-pdf';
import WebView from 'react-native-webview';
import {useSearch} from '../../../Providers/SearchProvider';
import {useFirebaseAuth} from '../../../Providers/FirebaseAuthProvider';
import {AD_UNIT_ID, BASE_URI} from '../../../shared/util';
import {
  LoadingSpinner,
  LoadingView,
} from '../../sharedComponents/LoadingSpinner';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';

export function PDFView({route}: SearchNavProps<'PDFView'>) {
  const {uri: preReportUri} = route.params;
  const {setCurrentReportUrl} = useSearch();
  const {user} = useFirebaseAuth();
  const {slug_name, slug_id} = route.params.report;
  const [error, setError] = useState<String | null>(null);
  const [uri, setUri] = useState<string>('');
  const [reportType, setReportType] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showAd, setShowAd] = useState<boolean>(true);

  async function getUri(slg: Number) {
    console.log('getting URI');
    setLoading(true);
    let tempUri: string = `${BASE_URI}/reportLink?id=_${slg}`;
    try {
      const res = await fetch(tempUri, {
        headers: {
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
      });
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
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  useEffect(() => {
    if (preReportUri) {
      console.log('ALREADY HAVE URI: ', preReportUri);

      setUri(preReportUri);
      setReportType(
        String(preReportUri).toLowerCase().includes('.pdf') ? 'pdf' : 'txt',
      );
      setCurrentReportUrl(preReportUri);
      setLoading(false);
    } else {
      setUri('');
      getUri(slug_id);
    }
  }, [slug_id, preReportUri]);

  if (reportType === 'txt') {
    return (
      <WebView
        startInLoadingState={true}
        renderLoading={() => <LoadingSpinner />}
        source={{uri}}
      />
    );
  }

  return (
    <LoadingView loading={loading}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 0,
        }}>
        <PDF
          source={{
            uri,
          }}
          trustAllCerts={true}
          onError={e => {
            Alert.alert('Error loading report. Please try again later');
            setLoading(false);
            setReportType('txt');
          }}
          activityIndicator={<LoadingSpinner />}
          enableAnnotationRendering
          onLoadComplete={() => setLoading(false)}
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'white',
          }}
        />
        {showAd ? (
          <View style={{backgroundColor: 'white'}}>
            <BannerAd
              unitId={__DEV__ ? TestIds.BANNER : AD_UNIT_ID}
              size={BannerAdSize.FULL_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: false,
              }}
              onAdFailedToLoad={(e: any) => {
                console.log(e);
                setShowAd(false);
              }}
              onAdClosed={() => {}}
              onAdLoaded={() => {
                setShowAd(true);
              }}
              onAdOpened={() => {}}
              onAdLeftApplication={() => {}}
            />
          </View>
        ) : null}
      </View>
    </LoadingView>
  );
}
