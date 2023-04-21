import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    // dark: true,
    themes: {
      light: {
        primary: '#382628',
        lightPrimary: '#99666B',
        darkPrimary1: '#513C3E',
        darkPrimary2: '#18242B',
        lightOrange: '#F1DDCD',
        warning: '#CD4949',
        lightWarning: '#EFCDD3',
        // lightPrimary1: '#F3E1C2',
        // lightPrimary2: '#F0CD8F',
        // grey: '#636363',
        // lightGrey1: '#DDDDDD',
        // lightGrey2: '#989898',
        // darkGrey: '#313131',
        // blackGrey: '#232324',
        // success: '#00A77B',
        // error: '#D2001C',
      },
    },
    options: {
      customProperties: true
    }
  },
});
