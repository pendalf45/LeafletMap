<template>
    <div>
        <h3>Всего найдено: {{ this.markers.length }}</h3>
        <div class="map" ref="mapContainer">
            Map
        </div>
    </div>

</template>

<script>
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import { mapGetters } from 'vuex';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
    import 'leaflet.markercluster';

    // BUG https://github.com/Leaflet/Leaflet/issues/4968
    import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
    import iconUrl from 'leaflet/dist/images/marker-icon.png'
    import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

    export default {
        name: 'Map',
        data() {
            return {
                mapInstance: null,
                clusterGroup: null,
                markers: [],
            }
        },
        computed: {
            ...mapGetters('map', {
                locations: 'getLocations',
            }),
        },
        methods : {
            fixBug() {
                // https://github.com/Leaflet/Leaflet/issues/4968
                L.Marker.prototype.options.icon = L.icon({
                    iconRetinaUrl,
                    iconUrl,
                    shadowUrl,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41]
                })
            },
            createMapInstance() { //по-хорошему думаю стоит хранить mapInstance в store, если будут другие компоненты, использующие тот же инстанс
                const map = L.map(this.$refs.mapContainer, { preferCanvas: true }).setView([59.213733, 39.881898], 13);
                const mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                });
                map.addLayer(mapLayer);
                this.clusterGroup = L.markerClusterGroup();
                map.addLayer(this.clusterGroup);
                this.mapInstance = map;
            },
            fitAllMarkers() {
                if (this.mapInstance && this.markers.length) {
                    const group = L.featureGroup(this.markers);
                    this.mapInstance.fitBounds(group.getBounds());
                }
            },
            removeMarkers() {
                if (this.mapInstance) {
                    for (let marker of this.markers) {
                        this.clusterGroup.removeLayer(marker);
                    }
                    this.markers = [];
                }
            },
            addMarkers() {
                if (this.mapInstance) {
                    for (let location of this.locations) {
                        const coordinates = location.geometry.coordinates;
                        if (coordinates) {
                            const info = location.properties;
                            let dtpInfoString = '';
                            //такое формирование popup для маркера не нравится, но пока не придумал как сделать это лучше
                            for (let [index, dtpInfo] of info.infoDtp.ts_info.entries()) {
                                dtpInfoString += `${index+1})
                                                  ${dtpInfo.marka_ts}
                                                  ${dtpInfo.m_ts}
                                                  ${dtpInfo.g_v} <br>`;

                                for (let passengerInfo of dtpInfo.ts_uch) {
                                    dtpInfoString += `${passengerInfo.K_UCH}
                                                      Пол: ${passengerInfo.POL}
                                                      Статус: ${passengerInfo.S_T} <br>`;
                                }
                            }
                            //здесь приходится менять координаты местами, но если использовать GeoJson тогда проблема
                            // с формированием popup маркера (именно dtpInfoString)
                            const marker = L.marker(new L.LatLng(coordinates[1], coordinates[0]), { title: info.DTP_V })
                                .bindPopup(`<b>Город</b>: ${info.District}<br>
                            <b>Тип:</b> ${info.DTP_V}
                            <br>
                            <b>Дата:</b> ${info.month}.${info.year}
                            <br>
                            <b>Время:</b> ${info.Time}
                            <br>
                            <b>Адрес:</b> ${info.infoDtp.street} ${info.infoDtp.house}
                            <br>
                            <b>Участники ДТП:</b> <br> ${dtpInfoString}`);
                            this.clusterGroup.addLayer(marker);
                            this.markers.push(marker);
                        }
                    }
                }
            },
        },
        watch: {
            locations() {
                this.removeMarkers();
                this.addMarkers();
                this.fitAllMarkers();
            }
        },
        mounted () {
            this.createMapInstance();
        },
        created() {
            this.fixBug();
            this.$store.dispatch('map/loadLocations');
        },
        beforeDestroy() {
            if (this.mapInstance) {
                this.mapInstance.remove();
            }
        },
    }

</script>

<style lang="sass">
    .map
        height: 500px
        width: 80%
        margin: 0 auto
    .leaflet-popup-content
        font-size: 14px

</style>
