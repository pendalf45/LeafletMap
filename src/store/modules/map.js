import Locations from '../../../geodata.json';

export default {
    namespaced: true,
    state: {
        originalLocations: [],
        locations: [],
        filtersParams: {
            dates: [],
            types: [],
        }
    },
    getters: {
        getLocations(state) {
            return state.locations;
        },
        getFiltersInfo(state) {
            return state.filtersParams;
        }
    },
    mutations: {
        setOriginalLocations(state, locations){
            state.originalLocations = locations;
        },
        resetLocations(state){
            state.locations = state.originalLocations;
        },
        setMapFiltersParams(state) {
            let minDate = 3000;
            let maxDate = 0;
            let types = [];
            for (let location of state.originalLocations) {
                const coordinates = location.geometry.coordinates;
                if (coordinates) {
                    const info = location.properties;
                    if(info.year > maxDate) maxDate = info.year;
                    if(info.year < minDate) minDate = info.year;
                    if(!types.includes(info.DTP_V)) {
                        types.push(info.DTP_V);
                    }
                }
            }

            let dates = [];
            for (let i = minDate; i <= maxDate; i+=1) {
                dates.push(i);
            }

            state.filtersParams.dates = dates;
            state.filtersParams.types = types;

        },
        applyMapFilters(state, payload){
            state.locations = state.locations.filter( (location) => {
                if (payload.checkedTypes.includes(location.properties.DTP_V) &&
                    payload.checkedDates.includes(location.properties.year)) {
                    return location;
                }
            });
        }
    },
    actions: {
        loadLocations(store) {
            setTimeout(() => {
                store.commit('setOriginalLocations', Locations);
                store.commit('resetLocations');
                store.commit('setMapFiltersParams');
                }, 100);
        },
        applyMapFilters(store, payload) {
            store.commit('resetLocations');
            store.commit('applyMapFilters', payload);
        }
    }
};
