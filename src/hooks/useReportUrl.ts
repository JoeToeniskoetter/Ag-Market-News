import React from 'react';
import {Alert} from 'react-native';
import {useFirebaseAuth} from '../Providers/FirebaseAuthProvider';
import {BASE_URI, ReportTypes} from '../shared/util';

const useReportUrl = (slg: Number) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<{
    url: string;
    type: ReportTypes;
  }>();
  const [error, setError] = React.useState<boolean>(false);
  const {
    state: {user},
  } = useFirebaseAuth();

  async () => {
    setLoading(true);
    let tempUri: string = `${BASE_URI}/reportLink?id=_${slg}`;
    try {
      const res = await fetch(tempUri, {
        headers: {
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
      });
      console.log(res.status);
      if (res.ok) {
        const json = await res.json();
        if (json.link) {
          let res = {
            link: json.link,
          };
          setReportType(String(json.link).includes('.pdf') ? 'pdf' : 'txt');
          setLoading(false);
        }
      } else {
        setLoading(false);
        console.log(res.status);
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  return {
    url: tempUri,
    type: ReportTypes.PDF,
  };
};

export default useReportUrl;
