<template>
  <div class="leaderboard-container">
    <h1>Classement</h1>
    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Nom d'utilisateur</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in leaderboard" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.username }}</td>
          <td>{{ entry.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      leaderboard: [],
    };
  },
  async created() {
    const response = await axios.get('http://localhost:3001/api/leaderboard', {
      params: { scenario: 'manoir-du-mal' }
    });
    if (response.data.success) {
      this.leaderboard = response.data.leaderboard;
    }
  },
};
</script>

<style scoped>
.leaderboard-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>