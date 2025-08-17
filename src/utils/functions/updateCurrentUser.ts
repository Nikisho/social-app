// helpers/user.ts
// import { AppDispatch } from '../redux/store';
import { Dispatch } from "@reduxjs/toolkit";
import { setCurrentUser } from "../../context/navSlice";

export function updateCurrentUser(dispatch: Dispatch, userData: any) {
  dispatch(setCurrentUser({
    name: userData.name,
    email: userData.email,
    photo: userData.photo,
    id: userData.id,
    sex: userData.sex,
    gemCount: userData.gem_count,
    isOrganizer: userData.is_organizer
  }));
}
