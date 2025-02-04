<template>
  <div class="lobby-container">
    <div class="overlay">
      <h1 class="title">Escape Game Lobby</h1>
      <div class="menu">
        <button @click="startGame" class="menu-button">Jouer</button>
        <button @click="goToSettings" class="menu-button">Paramètres</button>
        <button @click="logout" class="menu-button">Déconnexion</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameLobby',
  methods: {
    startGame() {
      this.$router.push('/manoir-du-mal');
    },
    goToSettings() {
      this.$router.push('/settings');
    },
    logout() {
      this.$store.dispatch('logoutUser');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.lobby-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../assets/acceuil.png') no-repeat center center fixed;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
}
.overlay {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  width: 80%;
  max-width: 400px;
}
.title {
  color: #fff;
  font-size: 28px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 10px rgba(255, 255, 255, 0.3);
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.menu-button {
  padding: 12px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.menu-button:hover {
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
  transform: scale(1.05);
}
</style>
