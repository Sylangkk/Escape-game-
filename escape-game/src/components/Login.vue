<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Se connecter</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  computed: {
    ...mapState(['authError']),
    errorMessage() {
      return this.authError;
    }
  },
  methods: {
    ...mapActions(['loginUser']),
    async login() {
      const credentials = { email: this.email, password: this.password };
      await this.loginUser(credentials);
      if (!this.authError) {
        this.$router.push('/dashboard');
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f9f9f9;
  text-align: center;
}
.input-group {
  margin-bottom: 15px;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #218838;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
