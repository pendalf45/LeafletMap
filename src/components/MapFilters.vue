<template>
    <section class="map-filters">
        <div class="map-filters-row">
        <!-- .filter думаю надо вынести в отдельный компонент, но пока их всего два, поэтому решил это не делать -->
            <div class="filter">
                <h3>Выбор даты:</h3>
                <div class="item" v-for="(value, index) in filtersInfo.dates" v-bind:key="`dates${index}`">
                    <input type="checkbox" :id="index" :value="value" v-model="filters.checkedDates">
                    <label :for="index">{{ value }}</label>
                </div>
            </div>
            <div class="filter">
                <h3>Выбор типа происшествия:</h3>
                <div class="item" v-for="(value, index) in filtersInfo.types" v-bind:key="`types${index}`">
                    <input type="checkbox" :id="index" :value="value" v-model="filters.checkedTypes">
                    <label :for="index">{{ value }}</label>
                </div>
            </div>
        </div>
        <div>
            <button class="btn" @click="selectAllCheckboxes">
                Выделить все пункты
            </button>
            <button class="btn reset" @click="resetAllCheckboxes">
                Сбросить все пункты
            </button>
        </div>

        <div>
            <button class="btn" @click="applyMapFilters">
                Применить фильтры
            </button>
            <button class="btn reset" @click="resetMapFilters">
                Сбросить фильтры
            </button>
        </div>

    </section>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "MapFilters",
        data() {
            return {
                filters: {
                    checkedDates: [],
                    checkedTypes: [],
                },
            }
        },
        computed: {
            ...mapGetters('map', {
                filtersInfo: 'getFiltersInfo',
            }),
        },
        methods: {
            resetMapFilters(){
                this.$store.commit('map/resetLocations');
                this.setDefaultMapFiltersParams();
            },
            applyMapFilters(){
                this.$store.dispatch('map/applyMapFilters', this.filters);
            },
            setDefaultMapFiltersParams(){
                this.filters.checkedDates = this.filtersInfo.dates;
                this.filters.checkedTypes = this.filtersInfo.types;
            },
            selectAllCheckboxes(){
                this.setDefaultMapFiltersParams();
            },
            resetAllCheckboxes(){
                this.filters.checkedDates = [];
                this.filters.checkedTypes = [];
            }
        },
        updated() {
            if(!this.isMapFiltersParamsLoaded) {  //не нравится этот момент. не нашел способ как удобно передать
                                                  // данные из store в data компонента
                this.setDefaultMapFiltersParams();
                this.isMapFiltersParamsLoaded = true;
            }
        },
    };
</script>

<style lang="sass">
    .map-filters
        margin-bottom: 15px
        .map-filters-row
            display: flex
            align-items: flex-start
            justify-content: center
            margin-bottom: 15px
            .filter
                text-align: left
                margin-right: 30px
                max-width: 300px
                .item
                    margin-bottom: 5px
            .filter:last-child
                margin-right: 0
        .btn
            font-size: 16px
            padding: 10px 20px
            color: #fff
            background-color: #2648d8
            cursor: pointer
        .reset
            background-color: #53b83b

</style>
