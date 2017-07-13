/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Rx = require('rxjs');
const axios = require('../../MapStore2/web/client/libs/ajax');
const {LOAD_REGIONS, ADD_EVENT, CANCEL_EDIT, CHANGE_INTERVAL, UPDATE_FILTERED_EVENTS, LOAD_EVENTS, SEARCH_TEXT_CHANGE, RESET_ALERTS_TEXT_SEARCH, loadEvents, loadRegions, regionsLoading, regionsLoaded, eventsLoadError, eventsLoaded, eventsLoading} = require('../actions/alerts');
const {createFilter} = require('../utils/AlertsUtils');
const moment = require('moment');

module.exports = {
    fetchRegions: (action$, store) =>
        action$.ofType(LOAD_REGIONS)
        .debounceTime(250)
        .switchMap((action) => {
            const {regionsPageSize = 10, regions = {}} = (store.getState()).alerts || {};
            const url = action.nextPage ? `${regions.next}&page_size=${regionsPageSize}` : `${action.url}?name__startswith=${action.searchText || ''}&page_size=${regionsPageSize}`;
            return Rx.Observable.fromPromise(
                axios.get(url).then(response => response.data)
            ).map((res) => {
                return regionsLoaded(res, action.nextPage );
            })
        .startWith(regionsLoading(true))
        .catch( (e) => {
            return Rx.Observable.from([
                    eventsLoadError(e.message || e)
            ]);
        })
        .concat([regionsLoading(false)]);
        }),
    resetRegions: (action$) =>
        action$.ofType(ADD_EVENT, CANCEL_EDIT)
        .debounceTime(250)
        .switchMap(() => {
            return Rx.Observable.of(loadRegions());
        }),
    updateEvents: (action$, store) =>
        action$.ofType(CHANGE_INTERVAL, UPDATE_FILTERED_EVENTS)
        .debounceTime(250)
        .map((action) => {
            const {hazards, levels, selectedRegions, searchInput, currentInterval} = (store.getState()).alerts || {};
            const int = action.type === CHANGE_INTERVAL ? action.interval : currentInterval;
            const filterParams = {hazards, levels, selectedRegions, searchInput, currentInterval: int};
            return loadEvents('/decat/api/alerts', 0, 10, filterParams);
        }),
        eventsTextSearch: (action$, store) =>
            action$.ofType(SEARCH_TEXT_CHANGE, RESET_ALERTS_TEXT_SEARCH)
            .debounceTime(250)
            .map((action) => {
                const {hazards, levels, selectedRegions, currentInterval} = (store.getState()).alerts || {};
                const searchInput = action.text;
                const filterParams = {hazards, levels, selectedRegions, searchInput, currentInterval};
                return loadEvents('/decat/api/alerts', 0, 10, filterParams);
            }),
        fetchEvents: (action$, store) =>
            action$.ofType(LOAD_EVENTS)
            .debounceTime(250)
            .switchMap((action) => {
                const {hazards, levels, selectedRegions, searchInput, currentInterval} = action.filterParams && action.filterParams || (store.getState()).alerts || {};
                const queryTime = moment();
                const queryInterval = currentInterval.value ? queryTime.clone().subtract(currentInterval.value, currentInterval.period).format("YYYY-MM-DD h:mm:ss") : undefined;
                const filter = createFilter(hazards, levels, selectedRegions, queryInterval, searchInput);
                return Rx.Observable.fromPromise(
                    axios.get(`${action.url}?page=${action.page + 1}&page_size=${action.pageSize}${filter}`).then(response => response.data)
                ).map((data) => {
                    return eventsLoaded(data, action.page, action.pageSize, queryTime);
                })
            .startWith(eventsLoading(true))
            .catch( (e) => {
                return Rx.Observable.from([
                        eventsLoadError(e.message || e)
                ]);
            })
            .concat([eventsLoading(false)]);
            })
};
