import auth from '@react-native-firebase/auth';
import {BASE_URI} from '../shared/util';

export const baseFetch = async (path: string) => {
  return fetch(`${BASE_URI}${path}`, {
    headers: {
      Authorization: `Bearer ${await auth().currentUser?.getIdToken()}`,
    },
  });
};
