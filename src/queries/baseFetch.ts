import auth from '@react-native-firebase/auth';
import {BASE_URI} from '../shared/util';

export const baseFetch = async (path: string) => {
  return fetch(`${BASE_URI}${path}`, {
    headers: {
      Authorization: `Bearer ${await auth().currentUser?.getIdToken()}`,
    },
  });
};

export const basePost = async (path: string, body: any) => {
  return fetch(`${BASE_URI}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await auth().currentUser?.getIdToken()}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
