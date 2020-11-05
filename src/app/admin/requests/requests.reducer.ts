import { createReducer, on, Action } from '@ngrx/store';
import { initialState, RequestsState } from './requests.state';
import {
  getRequestsAction,
  getRequestsSuccessAction,
  getRequestsFailureAction,
  getRequestAction,
  getRequestSuccessAction,
  getRequestFailureAction,
  saveRequestAction,
  saveRequestSuccessAction,
  saveRequestFailureAction,
  updateRequestAction,
  updateRequestSuccessAction,
  updateRequestFailureAction,
  getZonesSuccessAction,
  getBeneficiariesByFilterSuccesAction,
  getBeneficiariesByFilterFailureAction,
  getBeneficiariesByFilterAction,
} from './requests.actions';

const requestReducer = createReducer(
  initialState,
  on(getRequestsAction, (state) => ({
    ...state,
    error: null,
    isLoading: true,
  })),
  on(getRequestsSuccessAction, (state, { payload, count }) => ({
    ...state,
    isLoading: false,
    data: payload,
    count,
  })),
  on(getRequestsFailureAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(saveRequestAction, (state, volunteer) => ({
    ...state,
    error: null,
    isLoading: true,
  })),
  on(saveRequestSuccessAction, (state, { payload }) => ({
    ...state,
    isLoading: false,
    details: payload,
  })),
  on(saveRequestFailureAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(getRequestAction, (state) => ({
    ...state,
    error: null,
    isLoading: true,
  })),
  on(getRequestSuccessAction, (state, { payload }) => ({
    ...state,
    isLoading: false,
    error: null,
    details: payload,
  })),
  on(getRequestFailureAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(updateRequestAction, (state) => ({
    ...state,
    error: null,
    isLoading: true,
  })),
  on(updateRequestSuccessAction, (state, { payload }) => ({
    ...state,
    isLoading: false,
    error: null,
    details: payload,
  })),
  on(updateRequestFailureAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(getZonesSuccessAction, (state, { zones }) => ({
    ...state,
    zones,
  })),
  on(getBeneficiariesByFilterAction, (state) => ({
    ...state,
    error: null,
    isLoading: true,
  })),
  on(getBeneficiariesByFilterSuccesAction, (state, { payload }) => ({
    ...state,
    isLoading: false,
    data: payload,
  })),
  on(getBeneficiariesByFilterFailureAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);

export function requestsReducer(
  state: RequestsState | undefined,
  action: Action
) {
  return requestReducer(state, action);
}
