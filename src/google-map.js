import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC5NwRRRRY2U0LZs4PPc2ZwAHJxpiAlu0E',
    libraries: 'places', // This is required if you use the Autocomplete plugin
  },
})

Vue.use(VueGoogleAutocomplete)
