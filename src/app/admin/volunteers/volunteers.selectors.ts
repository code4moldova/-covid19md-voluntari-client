import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VolunteersState } from './volunteers.state';
import { Volunteer } from './shared/volunteer';
import { Demand } from '@demands/shared/demand';
import { LoadableState } from '@app/admin/shared/shared-states';

export const selectVolunteers = createFeatureSelector<any, VolunteersState>(
  'volunteers',
);

export const selectIsLoading = createSelector(
  selectVolunteers,
  (state: VolunteersState): boolean => {
    return state.isLoading;
  },
);
export const selectError = createSelector(
  selectVolunteers,
  (state: VolunteersState): any => {
    return state.error;
  },
);

export const selectVolunteersData = createSelector(
  selectVolunteers,
  (state: VolunteersState): Volunteer[] => {
    return state.data;
  },
);

export const selectVolunteersCount = createSelector(
  selectVolunteers,
  (state: VolunteersState): number => {
    return state.count;
  },
);

export const selectVolunteersDetails = createSelector(
  selectVolunteers,
  (state: VolunteersState): Volunteer => {
    return state.details;
  },
);

export const selectDemands = createSelector(
  selectVolunteers,
  (state: VolunteersState): any => {
    return state.demands;
  },
);

export const selectDemandsError = createSelector(
  selectDemands,
  (state: LoadableState<Demand>): any => {
    return state.error;
  },
);

export const selectDemandsData = createSelector(
  selectDemands,
  (state: LoadableState<Demand>): Demand[] => {
    return state.data;
  },
);

export const selectDemandsCount = createSelector(
  selectDemands,
  (state: LoadableState<Demand>): number => {
    return state.count;
  },
);
