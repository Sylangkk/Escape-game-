import BaseAPI from '../../BaseAPI'

const state = {
    showCardealer: process.env.NODE_ENV !== 'production',
    config: {},
    vehicleList: [],
    concess_name: '',
    concess_type: 'car' // motobike, truck, helicopter, plane
}
  
const getters = {
  showCardealer: ({ showCardealer }) => showCardealer,
  config: ({ config }) => config,
  vehicleList: ({ vehicleList }) => vehicleList,
  concess_name: ({ concess_name }) => concess_name,
  concess_type: ({ concess_type }) => concess_type
}
  
const actions = {
  closeCardealer () {
    BaseAPI.closeCardealerMenu()
  }
}
  
const mutations = {
  SET_VEHICLELIST(state, vehicles) {
    state.vehicleList = vehicles
  },
  SET_CONCESSNAME(state, value) {
    state.concess_name = value
  },
  SET_CONCESSTYPE(state, value) {
    state.concess_type = value
  }
}
  
export default {
  state,
  getters,
  actions,
  mutations
}

if (process.env.NODE_ENV !== 'production') {

  state.config = {
    color: "#de7d16",

    car_defaultcolor1: "235, 235, 235",
    car_defaultcolor2: "38, 38, 255",
    car_defaultcolor3: "255, 139, 38",
    car_defaultcolor4: "255, 38, 38",

    search_category: "Vehicle Search",

    name_text: "Name",
    buy_text: "Buy",
    preview_text: "Preview",
    search_text: "Search...",
    model_text: "Model",
    price_text: "Price",

    yes_text: "Yes",
    no_text: "No",

    buycar_yesno: "Are you sure you want to buy this vehicle ?"
  }

  state.concess_name = 'Car dealership'

  state.vehicleList = {
    'Off-road': [
      {
        name: 'Blista',
        model: 'blista',
        price: 2500,
      },
      {
        name: 'Issi v2',
        model: 'issi2',
        price: 3000,
      },
      {
        name: 'Blista',
        model: 'blista',
        price: 2500,
      },
      {
        name: 'Issi v2',
        model: 'issi2',
        price: 3000,
      },
      {
        name: 'Blista',
        model: 'blista',
        price: 2500,
      },
      {
        name: 'Issi v2',
        model: 'issi2',
        price: 3000,
      },
      {
        name: 'Blista',
        model: 'blista',
        price: 2500,
      },
      {
        name: 'Issi v2',
        model: 'issi2',
        price: 3000,
      },
      {
        name: 'Blista',
        model: 'blista',
        price: 2500,
      },
      {
        name: 'Issi v2',
        model: 'issi2',
        price: 3000,
      }
    ],
    'Muscle': [
      {
        name: 'Issi',
        model: 'issi',
        price: 3000,
      }
    ],
    'Sport': [
      {
        name: 'Felon',
        model: 'felon',
        price: 3000,
      },
    ],
  }
}