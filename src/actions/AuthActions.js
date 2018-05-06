import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import {
    LOGIN_RESET,
    LOGIN_FIELDS_CHANGED,
    LOGIN_USER_ERROR,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_START,
    LOGOUT_USER_START,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE,
    USER_ACCOUNT_FETCH_START,
    USER_ACCOUNT_FETCH_SUCCESS,
    USER_ACCOUNT_FETCH_FAILURE
} from './types';
import AsyncStorage, { AUTH_DATA } from '../utils/AsyncStorage';
import { I18nUtils } from '../utils/I18nUtils';
import { URL } from '../components/webservices/Request';

export const loginReset = () => {
    return {
        type: LOGIN_RESET
    };
};

export const loginFieldsChanged = ({ prop, value }) => {
    return {
        type: LOGIN_FIELDS_CHANGED,
        payload: { prop, value }
    };
};

export const loginUserError = ({ error }) => {
    return {
        type: LOGIN_USER_ERROR,
        payload: { error }
    };
};

export const loginUser = ({ email, password }) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER_START });

        const data = {
            email,
            password
        };

        axios.post(URL.concat('login'), data)
            .then(tokenResponse => {
                const { token } = tokenResponse.data;

                const config = {
                    headers: {
                        token
                    }
                };

                axios.get(URL.concat('user'), config)
                    .then(userResponse => {
                        const { id, name, surname } = userResponse.data;

                        // TODO: corregir
                        const language = userResponse.data.language ?
                            userResponse.data.language : 'es';

                        I18nUtils.setLocale(language);

                        dispatch({
                            type: LOGIN_USER_SUCCESS,
                            payload: { token, id, language, name, surnames: surname, email }
                        });

                        Actions.push('main');
                    })
                    .catch(error => {
                        dispatch({
                            type: LOGIN_USER_FAIL,
                            payload: error.message
                        });
                    });
            })
            .catch(error => {
                dispatch({
                    type: LOGIN_USER_FAIL,
                    payload: error.message
                });
            });
    };
};

// TODO: cambiar a webservice
export const logoutUser = () => {
    return (dispatch) => {
        dispatch({ type: LOGOUT_USER_START });

        // firebase.auth().signOut()
        //     .then(() => {
        //         AsyncStorage.delete(AUTH_DATA)
        //             .then(() => {
        //                 dispatch({
        //                     type: LOGOUT_USER_SUCCESS
        //                 });
        //
        //                 I18nUtils.setDeviceLocale();
        //
        //                 Actions.push('presentation');
        //             })
        //             .catch(error => {
        //                 dispatch({
        //                     type: LOGOUT_USER_FAILURE,
        //                     payload: error.message
        //                 });
        //             });
        //     })
        //     .catch((error) => {
        //         dispatch({
        //             type: LOGOUT_USER_FAILURE,
        //             payload: error.message
        //         });
        //     });
    };
};

export const userAccountFetchFromAsyncStorage = (addEventListeners) => {
    return (dispatch) => {
        dispatch({ type: USER_ACCOUNT_FETCH_START });

        AsyncStorage.get(AUTH_DATA)
            .then(data => {
                if (data) I18nUtils.setLocale(data.language);

                dispatch({
                    type: USER_ACCOUNT_FETCH_SUCCESS,
                    payload: data
                });

                addEventListeners();
            })
            .catch(error => {
                dispatch({
                    type: USER_ACCOUNT_FETCH_FAILURE,
                    payload: error.message
                });

                addEventListeners();
            });
    };
};
