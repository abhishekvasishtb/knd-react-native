import {AsyncStorage, NetInfo, ToastAndroid} from "react-native";
import base64 from "./Base64";
import AppConstants from "../constants/AppConstants";

import FormData from 'FormData';


export function checkConnection() {
    let check;
    return NetInfo.isConnected.fetch()
        // .then(response => { return response.json()})
        .then(isConnected => {
        check = isConnected
        // console.log('check from here '+ check);
        return isConnected;
    });
}

export async function checkConnectionAsync() {
    let check;
    return await NetInfo.isConnected.fetch()
    //     .then(isConnected => {
    //     check = isConnected
    //     console.log('check from here '+ check);
    //     return check;
    // });
}


export function checkConnectionBeta() {
    let check;
    return fetch('https://google.com')
        .then((response) => {
            // console.log('response ', response)
            if (response.status === 200) {
                console.log('success');
                return true
            } else {
                console.warn('error');
                return false
            }
        })
        .catch((error) => {
            console.error('network error: ' + error);
            return false

        })
    //     .then(isConnected => {
    //     check = isConnected
    //     console.log('check from here '+ check);
    //     return check;
    // });
}


export function setReviewResult(reviewId, checkList) {
    let username = 'admin';
    let password = 'admin';
    let formData = new FormData();
    formData.append('1', 'passed');
    formData.append('2', 'failed');
    let checkListString = '{"1": "passed", "2": "failed","3": "passed", "4": "failed", "5": "passed", "6": "failed", "7": "passed"}';
    console.log('SET REVIEW RESULT '+typeof reviewId + ' ' + typeof checkList);
    return fetch(AppConstants.BASE_URL+'/api/add/checkListResult?reviewId='+reviewId, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + base64.btoa((username + ":" + password)),
            Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkList),
        // body: formData,
    })
        .then((response) => {
            console.log('made json');
            response.json()})
        .then((responseJson) => {
            console.log('here is');
            return responseJson;
        })
        .catch((error) => {
            console.log('error from back '+error);
            console.log(error.text);
            console.log(error.responseText);
            console.log(error.statusText);

        });
}


export function setReviewStatus(reviewId, status) {
    let username = 'admin';
    let password = 'admin';

    let headers = new Headers();
    // headers.append('Authorization', 'Basic ' + base64(username + ":" + password));
    return fetch(AppConstants.BASE_URL+'/api/add/reviewResult?reviewId='+reviewId, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + base64.btoa((username + ":" + password)),
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: status
        }),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });

}


export async function setReviewResult2(reviewId, checkList) {
    let username = 'admin';
    let password = 'admin';
    let checkListParse = JSON.parse(checkList);

    console.log('SET REVIEW RESULT');
    let result = await fetch(AppConstants.BASE_URL+'/api/add/checkListResult?reviewId='+reviewId, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + base64.btoa((username + ":" + password)),
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkListParse),
    });

    console.log('SET REVIEW RESULT '+typeof reviewId + ' ' + typeof checkList);
    console.log(result)
}
