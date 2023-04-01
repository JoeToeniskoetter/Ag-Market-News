import React, {useEffect, useState} from 'react';
import {View, Alert, Dimensions} from 'react-native';
import {SearchNavProps} from '../SearchStackParams';
import PDF from 'react-native-pdf';
import WebView from 'react-native-webview';
import {useCurrentReport} from '../../../Providers/CurrentReportProvider';
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
import {useQuery} from 'react-query';
import {fetchReportUrl} from '../../../queries/reportUrl';
import {WebViewErrorEvent} from 'react-native-webview/lib/WebViewTypes';
import {RetryFetch} from '../../sharedComponents/RetryFetch';

export function PDFView({route}: SearchNavProps<'PDFView'>) {
  const {uri: preReportUri} = route.params;
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    `/reportUrl/${route.params.report.slug_id}`,
    () => fetchReportUrl(route.params.report.slug_id),
    {enabled: preReportUri == null},
  );
  const {setCurrentReportUrl} = useCurrentReport();
  const {slug_name, slug_id} = route.params.report;
  const [error, setError] = useState<String | null>(null);
  const [uri, setUri] = useState<string>('');
  const [reportType, setReportType] = useState<string>();
  const [pdfLoading, setPdfLoading] = useState<boolean>(true);
  const [showAd, setShowAd] = useState<boolean>(false);

  useEffect(() => {
    if (preReportUri) {
      setUri(preReportUri);
      setReportType(
        String(preReportUri).toLowerCase().includes('.pdf') ? 'pdf' : 'txt',
      );
      setCurrentReportUrl(preReportUri);
      setPdfLoading(false);
    }
  }, [slug_id, preReportUri]);

  useEffect(() => {
    if (data && data.link && data.link.includes('.txt')) {
      setReportType('txt');
    } else {
      setReportType('pdf');
    }
  }, [data?.link]);

  if (reportType === 'txt') {
    return (
      <LoadingView loading={isLoading}>
        <WebView
          startInLoadingState={true}
          renderLoading={() => <LoadingSpinner />}
          source={{uri: data?.link || uri}}
          onError={(e: WebViewErrorEvent) =>
            setError(e.nativeEvent.description)
          }
        />
      </LoadingView>
    );
  }

  return (
    <LoadingView loading={isLoading}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 0,
        }}>
        {isError ? (
          <RetryFetch retryFunction={refetch} />
        ) : (
          <PDF
            source={{
              uri: data?.link || uri,
            }}
            trustAllCerts={true}
            onError={e => {
              setPdfLoading(false);
              setReportType('txt');
            }}
            activityIndicator={<LoadingSpinner />}
            enableAnnotationRendering
            onLoadComplete={() => setPdfLoading(false)}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: 'white',
            }}
          />
        )}
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
