/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {DATA_LOADED, DATA_LOAD_ERROR, REGIONS_LOADED, REGIONS_LOAD_ERROR, EVENTS_LOADED, EVENTS_LOAD_ERROR, REGIONS_LOADING, SELECT_REGIONS, RESET_REGIONS_SELECTION, TOGGLE_ENTITY_VALUE, ADD_EVENT, CHANGE_EVENT_PROPERTY, TOGGLE_DRAW, CANCEL_EDIT, SEARCH_TEXT_CHANGE, RESET_ALERTS_TEXT_SEARCH, CHANGE_INTERVAL,
TOGGLE_ENTITIES} = require('../actions/alerts');

const assign = require('object-assign');

function alerts(state = null, action) {
    switch (action.type) {
    case DATA_LOADED:
        return assign({}, state, {
            [action.entity]: action.data.map((d) => assign({}, d, {
                selected: true
            }))
        });
    case DATA_LOAD_ERROR:
        return assign({}, state, {
            dataError: action.error,
            entityOnError: action.entity
        });
    case REGIONS_LOADED:
        const regions = action.concatOptions ? assign({}, action.regions, {results: [...state.regions.results].concat(action.regions.results || []) }) : action.regions;
        return assign({}, state, {
            regions: regions
        });
    case REGIONS_LOAD_ERROR:
        return assign({}, state, {
            regionsError: action.error
        });
    case REGIONS_LOADING: {
        return assign({}, state, {
            regionsLoading: action.loading
        });
    }
    case EVENTS_LOADED: {
        return assign({}, state, {
            events: action.events,
            eventsInfo: {
                page: action.page || 0,
                total: action.total || 0,
                pageSize: action.pageSize || 10,
                queryTime: action.queryTime
            }
        });
    }
    case EVENTS_LOAD_ERROR:
        return assign({}, state, {
            eventsError: action.error
        });
    case SELECT_REGIONS:
        return assign({}, state, {
            selectedRegions: action.selectedRegions
        });
    case RESET_REGIONS_SELECTION:
        return assign({}, state, {
            selectedRegions: []
        });
    case ADD_EVENT:
        return assign({}, state,
        {
            mode: 'ADD',
            currentEvent: {},
            regionsLoading: false,
            regions: [],
            drawEnabled: false
        });
    case CHANGE_EVENT_PROPERTY:
        const newEvent = assign({}, state.currentEvent || {}, {
            [action.property]: action.value
        });
        return assign({}, state, {
            currentEvent: newEvent
        });
    case TOGGLE_DRAW:
        return assign({}, state, {
            drawEnabled: !state.drawEnabled
        });
    case CANCEL_EDIT:
        return assign({}, state,
        {
            mode: 'LIST',
            currentEvent: {},
            regionsLoading: false,
            regions: [],
            drawEnabled: false
        });
    case TOGGLE_ENTITY_VALUE: {
        const entities = state[action.entitiesId].map((en, idx) => {
            return idx === action.entityIdx ? assign({}, en, {selected: action.checked}) : en;
        });
        return assign({}, state, {[action.entitiesId]: entities});
    }
    case TOGGLE_ENTITIES: {
        return assign({}, state, {[action.entitiesId]: state[action.entitiesId].map((en) => (assign({}, en, {selected: action.checked})))});
    }
    case SEARCH_TEXT_CHANGE:
        return assign({}, state, { searchInput: action.text});
    case RESET_ALERTS_TEXT_SEARCH:
        return assign({}, state, { searchInput: undefined});
    case CHANGE_INTERVAL:
        return assign({}, state, {currentInterval: action.interval});
    default:
        return state;
    }
}

module.exports = alerts;
