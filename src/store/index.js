import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import map from './modules/map';


export const store = new Vuex.Store({
	state: {

	},
	modules: {
		map,
	},
	strict: process.env.NODE_ENV !== 'production'
});
