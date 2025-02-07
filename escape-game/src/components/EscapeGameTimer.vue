<template>
  <div class="timer-component-container">
    <div class="timer-box">
      <span class="timer-text">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EscapeGameTimer', // ✅ Nom mis à jour
  props: {
    initialTime: {
      type: Number,
      required: true // Temps en secondes (ex: 1800 pour 30 min)
    }
  },
  data() {
    return {
      timeLeft: this.initialTime,
      timerInterval: null
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  },
  methods: {
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.timerInterval);
          this.$emit('time-up'); // ✅ Événement à la fin du timer
        }
      }, 1000);
    }
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  }
};
</script>

<style scoped>
.timer-component-container {
  background: rgba(56, 56, 56, 0.8);
  padding: 15px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(53, 53, 53, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 130px;
}

.timer-box {
  font-size: 28px;
  font-weight: bold;
  font-family: 'Digital-7', monospace;
  color: #ffffff;
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.678);
}
</style>
