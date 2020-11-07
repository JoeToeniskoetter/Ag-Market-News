import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import { Report } from './SearchProvider';
import messaging from '@react-native-firebase/messaging';

interface ISubscriptionContext{
  subscribe: (rpt:Report) => Promise<void>;
  unsubscribe: (slg:string) => Promise<void>;
  subscriptions: Report[] | []
}

const SubscriptionContext = createContext<ISubscriptionContext>({
  subscribe: async () => {},
  unsubscribe: async () => {},
  subscriptions: []
});


export const SubscriptionProvider:React.FC<{}> = ({children}) => {
const [storedSubscriptions, setStoredSubscriptions] = useState<Report[] | []>([]);

  async function loadSubscriptions(){
    const storedSubscriptions  = await AsyncStorage.getItem("subscriptions");
    if(!storedSubscriptions){
      let subs:Report[] = [];
      setStoredSubscriptions([]);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(subs));
    }else{
      setStoredSubscriptions(JSON.parse(storedSubscriptions));
    }
  }

  async function subscribe(rpt:Report){
    const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
    const storedToJson:Report[] = await JSON.parse(storedSubscriptions as any);
    if(storedToJson.some(r => r.slug_name == rpt.slug_name)){
      return
    } else {
      storedToJson.push(rpt);
      messaging().subscribeToTopic(rpt.slug_name);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(storedToJson));
      setStoredSubscriptions(storedToJson);
    }
  }

  async function unsubscribe(slg:string){
    const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
    const storedToJson:Report[] = await JSON.parse(storedSubscriptions as any);
    if(storedToJson.some(r => r.slug_name == slg)){
      storedToJson.filter(r => r.slug_name !== slg);
      messaging().unsubscribeFromTopic(slg);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(storedToJson));
      setStoredSubscriptions(storedToJson);
    }
  }

  useEffect(()=>{
    loadSubscriptions();
  },[])

return (
  <SubscriptionContext.Provider
  value={{
    subscribe,
    unsubscribe,
    subscriptions: []
  }}
  >
    {children}
  </SubscriptionContext.Provider>
)
}