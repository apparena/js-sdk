import axios from 'axios';
import {MissingArgumentError} from '../Exceptions';

export default class Api {
    constructor(params = {}) {
        if (!params.apiKey) {
            throw new MissingArgumentError('No Api-Key present.');
        }
        this._apiKey = params.apiKey;
        this._baseUrl = params.baseUrl || 'https://my.app-arena.com/api/v2/';
        this._axios = axios.create({
            baseURL: this._baseUrl,
            headers: {
                'Authorization': this._apiKey,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Returns the data of the requested route as array.
     *
     * @param route  Requested route
     * @param params Additional paramater for the request
     *
     * @return promise
     * TODO @throws \Exception Authorization failed exception
     */
    get(route, params = {}) {
        params.Authorization = this._apiKey;
        let promise = this._axios.get(route, params);
        promise.then((response) => {
            console.log('response', response);
            //TODO: try to request from cache
            if (response && response.status === 200) {
                //TODO: save to cache
                console.info('API get response', response);
            }
        });
        return promise;
    }
}