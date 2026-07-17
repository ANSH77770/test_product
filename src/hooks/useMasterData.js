import { useEffect, useState } from 'react';
import { masterDataService } from '@/services/masterDataService';

export function useMasterData() {
  const [masterData, setMasterData] = useState(masterDataService.getAll);
  useEffect(() => {
    const refresh = () => setMasterData(masterDataService.getAll());
    window.addEventListener(masterDataService.eventName, refresh);
    return () => window.removeEventListener(masterDataService.eventName, refresh);
  }, []);
  return masterData;
}
