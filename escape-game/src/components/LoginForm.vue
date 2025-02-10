<template>
  <div class="login-container">
    <h2>{{ isRegistering ? 'Inscription' : 'Connexion' }}</h2>
    <form @submit.prevent="isRegistering ? register() : login()">
      <div class="input-group">
        <label>Nom d'utilisateur</label>
        <input type="text" v-model="username" required />
      </div>
      <div v-if="isRegistering" class="input-group">
        <label>Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label>Mot de passe</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">{{ isRegistering ? 'S\'inscrire' : 'Se connecter' }}</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <button class="toggle-button" @click="toggleForm">
      {{ isRegistering ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
      isRegistering: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3001/api/login', {
          username: this.username,
          password: this.password,
        });

        if (response.data.success) {
          // Stocker le username dans Vuex
          this.$store.commit('setUser', this.username);
          this.$router.push('/lobby');
        } else {
          this.errorMessage = response.data.message || 'Identifiants incorrects';
        }
      } catch (error) {
        this.errorMessage = 'Erreur de connexion au serveur';
        console.error(error);
      }
    },
    async register() {
      try {
        const response = await axios.post('http://localhost:3001/api/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        if (response.data.success) {
          this.errorMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          this.isRegistering = false; // Basculer vers le formulaire de connexion
        } else {
          this.errorMessage = response.data.message || 'Erreur lors de l\'inscription';
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de l\'inscription';
        console.error(error);
      }
    },
    toggleForm() {
      this.isRegistering = !this.isRegistering;
      this.errorMessage = ""; // Réinitialiser le message d'erreur
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.input-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #218838;
}
.toggle-button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
.toggle-button:hover {
  background: #0056b3;
}
.error {
  color: red;
  font-size: 14px;
}
</style>