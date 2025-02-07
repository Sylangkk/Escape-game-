<template>
  <div class="game-container">
    <!-- Audio Introduction -->
    <audio ref="audioPlayer">
      <source :src="require('@/assets/intro.mp3')" type="audio/mpeg">
      Votre navigateur ne supporte pas l'élément audio.
    </audio>

    <!-- Audio pour la porte 1 -->
    <audio ref="doorAudio" loop @ended="closeDoor">
      <source :src="require('@/assets/femme.mp3')" type="audio/mpeg">
      Votre navigateur ne supporte pas l'élément audio.
    </audio>

    <div v-if="showDoorImage" class="door-image-container">
      <img :src="doorImage" alt="Porte ouverte" class="door-image" />
    </div>

    <div v-if="gameStarted" class="screens-container">
      <div 
        v-for="screen in screens" 
        :key="screen.id" 
        class="screen" 
        @click="selectScreen(screen.id)"
      ></div>
    </div>

    <div class="selectedRoom" v-if="selectedScreen" @click="closeSelectedRoom">
      <img :src="getScreenImage(selectedScreen)" alt="Sélection de la pièce" class="selectedRoom-image" />
      <div v-for="object in getObjectsForScreen(selectedScreen)" 
           :key="object.id" 
           class="object-button" 
           :style="{ top: object.position.y + 'px', left: object.position.x + 'px' }" 
           @click.stop="interactWithObject(object)">
        <button>{{ object.name }}</button>
      </div>
    </div>

    <div class="timer-container" v-if="timerStarted">
      <div class="actions-buttons" v-if="gameStarted">
        <button class="exit-button" @click="exitGame">Quitter</button>
        <button class="pause-button" @click="pauseGame">Pause</button>
      </div>

      <EscapeGameTimer :initialTime="1800" @time-up="handleTimeUp" />

      <div class="score-container">
        <h3>Score: {{ currentScore }}</h3>
      </div>
      
      <div class="inventory-container">
        <h3>Inventaire</h3>
        <ul>
          <li v-for="(item, index) in inventory" :key="index">
            {{ item.name }}
            <button @click="useItem(item)">Utiliser</button>
          </li>
        </ul>
      </div>
      
      <div class="clues-container">
        <button class="clues-button" @click="showNextClue">Indices</button>
      </div>
    </div>
    
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
      gameStarted: false,
      timerStarted: false,
      playerName: 'Wdife',
      currentScore: 10000,
      record: { name: 'Wdife', score: 200 },
      currentTimer: 1800,
      clues: [
        { id: 1, text: 'Trouvez la clé sous le tapis.' },
        { id: 2, text: 'Regardez derrière le tableau.' },
        { id: 3, text: 'Ouvrez le coffre-fort avec le code 1234.' }
      ],
      cluesFound: [],
      inventory: [
        { id: 1, name: 'Clé en fer', effect: 'Ouvre une porte verrouillée' },
        { id: 2, name: 'Lampe torche', effect: 'Éclaire les zones sombres' }
      ],
      screens: [
        { id: 1, name: 'bibliotheque', image: require('@/assets/bibliothèque.jpeg'), objects: [
          { id: 1, name: 'Livre', position: { x: 704, y: 398 } },
          { id: 2, name: 'Tableau', position: { x: 315, y: 285 } },
          { id: 3, name: 'Chaise', position: { x: 1339, y: 693 } }
        ] },
        { id: 2, name: 'galerie', description: 'Vous êtes dans le', image: require('@/assets/galerie.png'), objects: [
          { id: 4, name: 'T1', position: { x: 43, y: 136 } },
          { id: 5, name: 'T2', position: { x: 215, y: 215 } },
          { id: 6, name: 'T3', position: { x: 445, y: 301 } },
          { id: 7, name: 'T4', position: { x: 799, y: 398 } },
          { id: 8, name: 'T5', position: { x: 1143, y: 321 } },
          { id: 9, name: 'C1', position: { x: 190, y: 682 } },
          { id: 10, name: 'C2', position: { x: 1153, y: 673 } },
        ] },
        { id: 3, name: 'Cuisine', description: 'Vous êtes dans la', image: require('@/assets/cuisine.jpeg'),objects: [
          { id: 11, name: 'M1', position: { x: 634, y: 285 } },
          { id: 12, name: 'Ta1', position: { x: 594, y: 708 } },
          { id: 13, name: 'P1', position: { x: 1270, y: 141 } },
        ] },
        { id: 4, name: 'entrée', description: 'Vous êtes dans la', image: require('@/assets/entree.jpg'), objects: [
          { id: 14, name: 'Porte', position: { x: 911, y: 433 } },
          { id: 15, name: 'T6s', position: { x: 91, y: 241 } },
        ] },
        { id: 5, name: 'controle', description: 'Vous êtes dans la', image: require('@/assets/controle.png'), objects: [
          {id: 16, name: 'Porte1', position: { x: 135, y: 507 } },
          {id: 17, name: 'Porte2', position: { x: 1466, y: 457 } },
        ] },
        { id: 6, name: 'salle à manger', description: 'Vous êtes dans le', image: require('@/assets/salle_manger.jpg') },
        { id: 7, name: 'salle de bain', description: 'Vous êtes dans la', image: require('@/assets/salledebain.jpeg') },
        { id: 8, name: 'salon', description: 'Vous êtes dans le', image: require('@/assets/salon.jpg') },
        { id: 9, name: 'chambre', description: 'Vous êtes dans le', image: require('@/assets/chambre.jpg') }
      ],
      selectedScreen: null,
      showDoorImage: false,
      doorImage: require('@/assets/femme.png'),
      penaltyPerClue: 50,
      penaltyPerSecond: 1
    };
  },
  mounted() {
    this.playAudio(); // Jouer l'audio dès que le composant est monté
    setTimeout(() => {
      this.showOverlay = false;
      this.showButton = true;
    }, 18000); // Conserver le délai pour l'affichage de l'overlay et du bouton
  },
  methods: {
    playAudio() {
      const audio = this.$refs.audioPlayer;
      if (audio) {
        audio.play();
      }
    },
    stopIntroAudio() {
      const audio = this.$refs.audioPlayer;
      if (audio) {
        audio.pause(); // Arrêter l'audio
        audio.currentTime = 0; // Remettre l'audio au début (optionnel)
      }
    },
    enableAudioPlayback() {
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.play();
      }
    },
    startGame() {
      console.log('Jeu démarré');
      this.timerStarted = true;
      this.showButton = false;
      this.gameStarted = true;

      this.startScoreCountdown();
    },
    selectScreen(screenId) {
      this.selectedScreen = screenId;
    },
    closeSelectedRoom() {
      this.selectedScreen = null;
    },
    getScreenImage(screenId) {
      const screen = this.screens.find(screen => screen.id === screenId);
      console.log(screen);
      return screen ? screen.image : '';
    },
    getObjectsForScreen(screenId) {
      const screen = this.screens.find(screen => screen.id === screenId);
      return screen ? screen.objects : [];
    },
    interactWithObject(object) {
      if (object.name === 'Porte1') {
        this.showDoorImage = true;
        const audio = this.$refs.doorAudio;
        if (audio) {
          audio.play();
        }

        setTimeout(() => {
          this.closeDoor();
        }, 6000);
      } else {
        alert(`Vous avez interagi avec : ${object.name}`);
        if (!this.inventory.some(item => item.id === object.id)) {
          this.inventory.push(object);
          alert(object.effect);
        } else {
          alert('Cet objet est déjà dans votre inventaire.');
        }
      }
    },
    closeDoor() {
      this.showDoorImage = false;
      const audio = this.$refs.doorAudio;
      if (audio) {
        audio.pause();
      }
    },
    exitGame() {
      if (confirm('Voulez-vous vraiment quitter le jeu ?')) {
        this.$router.push('/');
      }
    },
    pauseGame() {
      alert('Jeu en pause');
    },
    showNextClue() {
      if (this.clues.length > 0) {
        alert(this.clues[0].text);
        this.clues.shift();
      } else {
        alert("Il n'y a plus d'indices disponibles.");
      }
    },
    startScoreCountdown() {
      if (!this.timerStarted) return;
      const interval = setInterval(() => {
        if (this.timerStarted && this.currentScore > 0) {
          this.currentScore -= this.penaltyPerSecond;
        } else {
          clearInterval(interval);
        }
      }, 1000);
    },
    handleTimeUp() {
      alert("Le temps est écoulé ! Votre score final est : " + this.currentScore);
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

.timer-container {
  top: 10%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 2.5vw;
  width: 80%;
  z-index: 999;
}

.inventory-container {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  text-align: center;
  max-width: 250px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.inventory-container h3 {
  margin-bottom: 10px;
  color: #333;
}

.inventory-container ul {
  list-style-type: none;
  padding: 0;
}

.inventory-item {
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.inventory-item button {
  background: #008080;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.inventory-item button:hover {
  background: #005757;
}

.clues-container {
  margin-top: 15px;
}

.screens-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 45vh;
  margin-left: 32vw;
}

.screen {
  width: 12vw;
  height: 15vh;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #444;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
}

.screen:hover {
  background: rgba(255, 255, 255, 0.2);
}

.selectedRoom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: left;
  align-items: center;
  z-index: 100;
}

.selectedRoom-image {
  width: 80%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.object-button {
  position: absolute;
  z-index: 10;
}
.object-button button {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.object-button button:hover {
  background: rgba(255, 255, 255, 0.3);
}
.actions-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.score-container {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #ff4500;
}

.door-image-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.door-image {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  border-radius: 10px;
  z-index: 999;
}

</style>