<template>
  <div class="game-container">
    <audio ref="audioPlayer" loop>
      <source src="@/assets/intro.mp3" type="audio/mpeg">
      Votre navigateur ne supporte pas l'élément audio.
    </audio>
    <!-- Timer démarre uniquement si timerStarted est vrai -->
    <EscapeGameTimer v-if="timerStarted" :initialTime="1800" @time-up="handleTimeUp" />
    <div v-if="showOverlay" class="overlay">
      <h1>Bienvenue au Manoir du Mal</h1>
    </div>
    <button v-if="showButton" class="play-button" @click="startGame">Jouer</button>
  </div>
</template>

<script>
import EscapeGameTimer from '@/components/EscapeGameTimer.vue';

export default {
  name: 'ManoirDuMal',
  components: { EscapeGameTimer },
  data() {
    return {
      showOverlay: true,
      showButton: false,
      timerStarted: false, // Variable pour contrôler le démarrage du timer
      playerName: 'Wdife',
      currentScore: 100,
      record: { name: 'Wdife', score: 200 },
      currentTimer: 1800,
      clues: [
        { id: 1, text: 'Trouvez la clé sous le tapis.' },
        { id: 2, text: 'Regardez derrière le tableau.' },
        { id: 3, text: 'Ouvrez le coffre-fort avec le code 1234.' }
      ],
      cluesFound: []
    };
  },
  mounted() {
    this.playAudio();

    setTimeout(() => {
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.pause();
      }
      this.showOverlay = false;
      this.showButton = true;
    }, 18000);
  },
  methods: {
    playAudio() {
      const audio = this.$refs.audioPlayer;
      if (audio) {
        audio.play().catch(() => {
          console.warn("Lecture automatique bloquée, ajout d'un déclenchement manuel.");
          document.addEventListener('click', this.enableAudioPlayback, { once: true });
        });
      }
    },
    enableAudioPlayback() {
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.play();
      }
    },
    startGame() {
      console.log('Jeu démarré');
      this.timerStarted = true; // Démarre le timer lorsque le joueur clique sur "Jouer"
      this.showButton = false; // Cache le bouton "Jouer"
    },
    handleTimeUp() {
      console.log("Le temps est écoulé ! Fin du jeu.");
      alert("Temps écoulé ! Le jeu est terminé.");
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/final.png');
  background-color: black;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: absolute;
  top: 0;
  left: 0;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: white;
}

.play-button {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  background-color: #ff4500;
  color: white;
  cursor: pointer;
}

.play-button:hover {
  background-color: #cc3700;
}
</style>
