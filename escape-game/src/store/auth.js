import axios from "axios";

export default {
  state: {
    token: localStorage.getItem("token") || "",
    authError: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    setError(state, error) {
      state.authError = error;
    },
    logout(state) {
      state.token = "";
      localStorage.removeItem("token");
    },
  },
  actions: {
    async loginUser({ commit }, credentials) {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
        commit("setToken", response.data.token);
      } catch (error) {
        commit("setError", error.response.data.message || "Échec de connexion");
      }
    },
    logoutUser({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
};
