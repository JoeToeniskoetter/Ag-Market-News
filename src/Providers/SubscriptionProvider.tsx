import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, createContext, useEffect, useRef} from 'react';
import { Report } from './SearchProvider';
import messaging from '@react-native-firebase/messaging';
import { AppState, AppStateStatic, AppStateStatus } from 'react-native';

interface ISubscriptionContext{
  newReports: Report[] | [];
  newReportViewed: (rpt:Report) => void;
  newReportAvailable: (rpt:Report) => void;
}

export const SubscriptionContext = createContext<ISubscriptionContext>({
  newReports: [],
  newReportViewed: async (rpt:Report) => {},
  newReportAvailable: async (rpt:Report) => {}
});

export const SubscriptionProvider:React.FC<{}> = ({children}) => {
  const [newReports, setNewReports] = useState<Report[] | []>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("app was backgrounded. Updating subscriptions")
      setupSubscriptionProvider();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  async function newReportAvailable(rpt:Report){
    const subs = await AsyncStorage.getItem('subscriptions');  
    const subsToJson:Report[] = await JSON.parse(subs as any);

    if(subsToJson.some(r => r.slug_name === rpt.slug_name)){
      return
    }
    subsToJson.push(rpt);
    await AsyncStorage.setItem('subscriptions', JSON.stringify(subsToJson));
    setNewReports(subsToJson);
  }

  async function newReportViewed(rpt:Report){
    const subs = await AsyncStorage.getItem('subscriptions');  
    const subsToJson:Report[] = await JSON.parse(subs as any);

    const newList = subsToJson.filter(r => r.slug_name !== rpt.slug_name);
    await AsyncStorage.setItem('subscriptions', JSON.stringify(newList))
    setNewReports(newList)

  }

  async function setupSubscriptionProvider() {
    messaging().requestPermission();
    let subs = await AsyncStorage.getItem('subscriptions')
    
    if(!subs){
      await AsyncStorage.setItem('subscriptions', JSON.stringify([]))
      await setNewReports([])
    }else{
      const subsToJson:Report[] = await JSON.parse(subs)
      setNewReports(subsToJson);
    }
  }

  useEffect(()=>{
    setupSubscriptionProvider()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if(!remoteMessage.data ||!remoteMessage.data.report){
        return
      }
      newReportAvailable(JSON.parse(remoteMessage.data.report))
    });
    return unsubscribe;
  },[])

  


  return (
    <SubscriptionContext.Provider value={{
      newReports,
      newReportAvailable,
      newReportViewed,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}