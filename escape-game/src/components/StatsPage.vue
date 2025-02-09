<template>
  <div class="stats-container">
    <h1>Statistiques</h1>
    <div v-if="stats">
      <p>Parties jouées : {{ stats.gamesPlayed }}</p>
      <p>Score moyen : {{ stats.avgScore }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      stats: null,
    };
  },
  async created() {
    const response = await axios.get('http://localhost:3001/api/stats', {
      params: { username: "test" }
    });
    if (response.data.success) {
      this.stats = response.data.stats;
    }
  },
};
</script>

<style scoped>
.stats-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>