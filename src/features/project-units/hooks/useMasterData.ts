import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { masterDataApi } from '../api/masterDataApi';
import { MASTER_DATA_GROUPS } from '../constants';

export const useMasterData = (projectId?: number) => {
  const masterDataQuery = useQuery({
    queryKey: ['masterData'],
    queryFn: () => masterDataApi.getMasterData(),
    staleTime: 5 * 60 * 1000,
  });

  const phasesQuery = useQuery({
    queryKey: ['phases', projectId],
    queryFn: () => masterDataApi.getPhases(projectId!),
    enabled: Boolean(projectId),
    staleTime: 5 * 60 * 1000,
  });

  const allItems = masterDataQuery.data?.data || [];
  const phases = phasesQuery.data?.data || [];

  const statuses = useMemo(() => {
    return allItems.filter((item) => item.groupCode === MASTER_DATA_GROUPS.UNIT_STATUS);
  }, [allItems]);

  const unitTypes = useMemo(() => {
    return allItems.filter((item) => item.groupCode === MASTER_DATA_GROUPS.UNIT_TYPE);
  }, [allItems]);

  const directions = useMemo(() => {
    return allItems.filter((item) => item.groupCode === MASTER_DATA_GROUPS.DIRECTION);
  }, [allItems]);

  const statusMap = useMemo(() => {
    return Object.fromEntries(statuses.map((item) => [item.code, item.value]));
  }, [statuses]);

  const unitTypeMap = useMemo(() => {
    return Object.fromEntries(unitTypes.map((item) => [item.code, item.value]));
  }, [unitTypes]);

  const directionMap = useMemo(() => {
    return Object.fromEntries(directions.map((item) => [item.code, item.value]));
  }, [directions]);

  const phaseMap = useMemo(() => {
    return Object.fromEntries(phases.map((item) => [item.id, item.name]));
  }, [phases]);

  return {
    isLoading: masterDataQuery.isLoading || phasesQuery.isLoading,
    statuses,
    unitTypes,
    directions,
    phases,
    statusMap,
    unitTypeMap,
    directionMap,
    phaseMap,
  };
};

export default useMasterData;
