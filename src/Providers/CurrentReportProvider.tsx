import React, {createContext, useState, Dispatch, SetStateAction} from 'react';

interface ISearchProvder {
  setCurrentReportUrl: Dispatch<SetStateAction<string | undefined>>;
  currentReportUrl: string | undefined;
}

export const CurrentReportContext = createContext<ISearchProvder>({
  setCurrentReportUrl: () => {},
  currentReportUrl: undefined,
});

export const CurrentReportProvider: React.FC<{}> = ({children}) => {
  const [currentReportUrl, setCurrentReportUrl] = useState<string>();

  return (
    <CurrentReportContext.Provider
      value={{
        setCurrentReportUrl,
        currentReportUrl,
      }}>
      {children}
    </CurrentReportContext.Provider>
  );
};

export const useCurrentReport = () => React.useContext(CurrentReportContext);
