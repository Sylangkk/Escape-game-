<template>
  <div class="timer-component-container">
    <div class="timer-box">
      <span class="timer-text">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EscapeGameTimer',
  props: {
    initialTime: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      timeLeft: this.initialTime, // Initialiser timeLeft avec initialTime
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
          this.$emit('time-up');
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