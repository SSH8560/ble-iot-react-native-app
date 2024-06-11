import {useEffect} from 'react';

const useLifeCycleLogger = (screenName: string) => {
  useEffect(() => {
    console.log(`${screenName} Mounted`);

    return () => console.log(`${screenName} unMounted`);
  }, [screenName]);
};

export default useLifeCycleLogger;
