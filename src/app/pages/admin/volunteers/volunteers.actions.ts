import { createAction, props } from '@ngrx/store';
import { IVolunteer } from '@models/volunteers';
import { PageEvent } from '@angular/material/paginator';

export enum ActionTypes {
  GET_VOLUNTEERS = '[Volunteers] Get Volunteers',
  GET_VOLUNTEERS_SUCCESS = '[Volunteers] Get Volunteers Success',
  GET_VOLUNTEERS_FAILURE = '[Volunteers] Get Volunteers Failure',

  GET_VOLUNTEER = '[Volunteer] Get Volunteer',
  GET_VOLUNTEER_SUCCESS = '[Volunteer] Get Volunteer Success',
  GET_VOLUNTEER_FAILURE = '[Volunteer] Get Volunteer Failure',

  GET_VOLUNTEERS_BY_FILTER = '[Volunteers] Get Volunteers By Filter',
  GET_VOLUNTEERS_BY_FILTER_SUCCES = '[Volunteers] Get Volunteers By Filter Success',
  GET_VOLUNTEERS_BY_FILTER_FAILURE = '[Volunteers] Get Volunteers By Filter Failure',

  SAVE_VOLUNTEER = '[Volunteer] Save Volunteer',
  SAVE_VOLUNTEER_SUCCESS = '[Volunteer] Save Volunteer Success',
  SAVE_VOLUNTEER_FAILURE = '[Volunteer] Save Volunteer Failure',

  UPDATE_VOLUNTEER = '[Volunteer] Update Volunteer',
  UPDATE_VOLUNTEER_SUCCESS = '[Volunteer] Update Volunteer Success',
  UPDATE_VOLUNTEER_FAILURE = '[Volunteer] Update Volunteer Failure',
}

export const getVolunteersAction = createAction(
  ActionTypes.GET_VOLUNTEERS,
  props<{ page: { pageSize: number; pageIndex: number }; filters?: any }>()
);
export const getVolunteersFailureAction = createAction(
  ActionTypes.GET_VOLUNTEERS_FAILURE,
  props<{ error: any }>()
);
export const getVolunteersSuccessAction = createAction(
  ActionTypes.GET_VOLUNTEERS_SUCCESS,
  props<{ payload: IVolunteer[]; count: number }>()
);

export const getVolunteerAction = createAction(
  ActionTypes.GET_VOLUNTEER,
  props<{ id: string }>()
);
export const getVolunteerSuccessAction = createAction(
  ActionTypes.GET_VOLUNTEER_SUCCESS,
  props<{ payload: IVolunteer }>()
);
export const getVolunteerFailureAction = createAction(
  ActionTypes.GET_VOLUNTEER_FAILURE,
  props<{ error: any }>()
);

export const saveVolunteerAction = createAction(
  ActionTypes.SAVE_VOLUNTEER,
  props<{ payload: IVolunteer }>()
);
export const saveVolunteerFailureAction = createAction(
  ActionTypes.SAVE_VOLUNTEER_FAILURE,
  props<{ error: any }>()
);
export const saveVolunteerSuccessAction = createAction(
  ActionTypes.SAVE_VOLUNTEER_SUCCESS,
  props<{ payload: any }>()
);

export const updateVolunteerAction = createAction(
  ActionTypes.UPDATE_VOLUNTEER,
  props<{ payload: IVolunteer }>()
);
export const updateVolunteerFailureAction = createAction(
  ActionTypes.UPDATE_VOLUNTEER_FAILURE,
  props<{ error: any }>()
);
export const updateVolunteerSuccessAction = createAction(
  ActionTypes.UPDATE_VOLUNTEER_SUCCESS,
  props<{ payload: any }>()
);

export const getVolunteersByFilterAction = createAction(
  ActionTypes.GET_VOLUNTEERS_BY_FILTER,
  props<{ payload: { [keys: string]: string } }>()
);

export const getVolunteersByFilterSuccessAction = createAction(
  ActionTypes.GET_VOLUNTEERS_BY_FILTER_SUCCES,
  props<{ payload: IVolunteer[] }>()
);

export const getVolunteersByFilterFailureAction = createAction(
  ActionTypes.GET_VOLUNTEERS_BY_FILTER_FAILURE,
  props<{ error: any }>()
);
