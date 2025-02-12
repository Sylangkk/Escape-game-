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

    <!-- Audio pour la porte 2 -->
    <audio ref="door2Audio" @ended="closeDoor">
      <source :src="require('@/assets/iamcommingforyou.mp3')" type="audio/mpeg">
      Votre navigateur ne supporte pas l'élément audio.
    </audio>

    <!-- Audio pour la baignoire -->
    <audio ref="baignoireAudio" @ended="handleBaignoireAudioEnd">
      <source :src="require('@/assets/baignoire.mp3')" type="audio/mpeg">
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

      <EscapeGameTimer :initialTime="currentTimer" @time-up="handleTimeUp" />
      
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
        <button 
          class="clues-button" 
          @click="showNextClue" 
          :disabled="!selectedScreen || !getCluesForScreen(selectedScreen).length">
          Indices
        </button>
      </div>
    </div>
    
    <div v-if="showOverlay" class="overlay">
      <h1>Bienvenue au Manoir du Mal</h1>
    </div>
    <button v-if="showButton" class="play-button" @click="startGame">Jouer</button>
  </div>

  <div v-if="showRepasImage" class="repas-image-container" @click="closeRepasImage">
    <div class="repas-image-content" @click.stop>
      <img :src="require('@/assets/repas.png')" alt="Repas" class="repas-image" />
      <button class="close-button" @click="closeRepasImage">Fermer</button>
    </div>
  </div>

  <div v-if="showMedaillonImage" class="medaillon-image-container" @click="closeMedaillonImage">
    <div class="medaillon-image-content" @click.stop>
      <img 
        :src="require('@/assets/medaillon.png')" 
        alt="Médaillon" 
        class="medaillon-image" 
        @click="handleMedaillonClick"
      />
      <button class="close-button" @click="closeMedaillonImage">Fermer</button>
    </div>
  </div>

</template>

<script>
import EscapeGameTimer from '@/components/EscapeGameTimer.vue';
import axios from 'axios';

export default {
  name: 'ManoirDuMal',
  components: { EscapeGameTimer },
  data() {
    return {
      showRepasImage: false,
      showOverlay: true,
      showButton: false,
      gameStarted: false,
      timerStarted: false,
      playerName: 'Wdife',
      initialTime: 1800,
      currentScore: 10000,
      record: { name: 'Wdife', score: 200 },
      currentTimer: 1800,
      showMedaillonImage: false, // Nouvelle variable pour contrôler l'affichage de medaillon.png
      clues: [
        { id: 1, text: 'Trouvez la clé sous le tapis.' },
        { id: 2, text: 'Regardez derrière le tableau.' },
        { id: 3, text: 'Ouvrez le coffre-fort avec le code 1234.' }
      ],
      cluesFound: [],
      inventory: [
        { id: 1, name: 'Lampe torche', effect: 'Éclaire les zones sombres' }
      ],
      screens: [
        { id: 1, name: 'bibliotheque', image: require('@/assets/bibliothèque.jpeg'), isLocked: false, 
          objects: [
            { id: 1, name: 'Livre', position: { x: 704, y: 398 }, isEnigma: true }, // Ajout de l'attribut isEnigma
            { id: 2, name: 'Tableau', position: { x: 315, y: 285 }, isUseless: true }, // Tableau (ne sert à rien)
            { id: 3, name: 'Chaise', position: { x: 1339, y: 693 }, isUseless: true }  // Chaise (ne sert à rien)
          ],
          clues: [ "Trouvez la clé sous le tapis." ]
        },
        {
          id: 2,
          name: 'galerie',
          description: 'Vous êtes dans le',
          image: require('@/assets/galerie.png'),
          isLocked: true,
          isEnigma: true,
          objects: [
            { id: 4, name: 'T1', position: { x: 43, y: 136 }, age: 25 }, // Tableau 1
            { id: 5, name: 'T2', position: { x: 215, y: 215 }, age: 32 }, // Tableau 2
            { id: 6, name: 'T3', position: { x: 445, y: 301 }, age: 18 }, // Tableau 3
            { id: 7, name: 'T4', position: { x: 799, y: 398 }, age: 47 }, // Tableau 4
            { id: 8, name: 'T5', position: { x: 1143, y: 321 }, age: 56 }, // Tableau 5
            { id: 9, name: 'Couloir', position: { x: 1153, y: 673 }, item: 'none' }, // Couloir
          ],
          clues: ["Trouvez la clé sous le tapis."]
        },
        { id: 3, name: 'Cuisine', description: 'Vous êtes dans la', image: require('@/assets/cuisine.jpeg'), isLocked: true, objects: 
          [
            { id: 11, name: 'M1', position: { x: 634, y: 285 }, isUseless: true },
            { id: 12, name: 'Ta1', position: { x: 594, y: 708 }, isUseless: true },
            { id: 13, name: 'P1', position: { x: 1270, y: 141 }, isUseless: true },
            { id: 14, name: 'Placard', position: { x: 78, y: 713 }, isUseless: true },
            { id: 15, name: 'Tiroir', position: { x: 1172, y: 707 } }
          ],
        clues: [ "Trouvez la clé sous le tapis." ]
        },
        { id: 4, name: 'entrée', description: 'Vous êtes dans la', image: require('@/assets/entree.jpg'), isLocked: true, objects: [
            { id: 14, name: 'Porte', position: { x: 911, y: 433 } },
            { id: 15, name: 'T6s', position: { x: 91, y: 241 } },
          ], 
          clues: [ "Trouvez la clé sous le tapis." ]
        },
        { id: 5, name: 'controle', description: 'Vous êtes dans la', image: require('@/assets/controle.png'), isLocked: true, 
          objects: [
            {id: 16, name: 'Porte1', position: { x: 135, y: 507 } },
            {id: 17, name: 'Porte2', position: { x: 1466, y: 457 } },
          ],
          clues: [ "Trouvez la clé sous le tapis." ]
        },
        { id: 6, name: 'salle à manger', description: 'Vous êtes dans le', image: require('@/assets/salle_manger.jpg'), isLocked: true,
          objects: [
            { id: 14, name: 'horloge', position: { x: 1104, y: 123 } },
            { id: 15, name: 'Assiette', position: { x: 475, y: 763 } },
            { id: 16, name: 'Armoire', position: { x: 1509, y: 437 } },
          ], 
          clues: [ "Trouvez la clé sous le tapis." ]
         },
         { 
          id: 7, 
          name: 'salle de bain', 
          description: 'Vous êtes dans la', 
          image: require('@/assets/salledebain.jpeg'), 
          isLocked: true, 
          objects: [
            { id: 17, name: 'Miroir', position: { x: 194, y: 216 }, isEnigma: true }, // Miroir pour l'énigme
            { id: 19, name: 'Lavabo', position: { x: 299, y: 566 }, isUseless: true }, // Objet inutile
            { id: 20, name: 'Baignoire', position: { x: 770, y: 640 } } // Nouvel objet : Baignoire
          ],
          clues: ["Regardez attentivement le miroir pour trouver un indice."]
        },
        { 
          id: 8, 
          name: 'salon', 
          description: 'Vous êtes dans le', 
          image: require('@/assets/salon.jpg'), 
          isLocked: true, 
          objects: [
            { id: 21, name: 'Tableau', position: { x: 335, y: 342 }, clue: "En bas du cadre, un chiffre est discrètement gravé : 12." },
            { id: 22, name: 'Vase', position: { x: 139, y: 492 }, clue: "Sous le vase, un petit chiffre est inscrit : 8." },
            { id: 23, name: 'Table basse', position: { x: 800, y: 764 }, clue: "Une gravure sur un coin indique le nombre : 6." },
            { id: 24, name: 'Coffre', position: { x: 614, y: 437 }, isEnigma: true }
          ],
          clues: ["Trouvez les chiffres cachés dans les objets et additionnez-les pour ouvrir le coffre."]
        },
        { 
          id: 9, 
          name: 'chambre', 
          description: 'Vous êtes dans le', 
          image: require('@/assets/chambre.jpg'), 
          isLocked: true, 
          objects: [
            { id: 25, name: 'ChambreTableau', position: { x: 100, y: 150 }, clue: "En bas du cadre, un chiffre est discrètement gravé : 12." },
            { id: 26, name: 'ChambreHorloge', position: { x: 300, y: 250 }, clue: "Sous le vase, un petit chiffre est inscrit : 8." },
            { id: 27, name: 'ChambreLit', position: { x: 500, y: 350 }, clue: "Une gravure sur un coin indique le nombre : 6." },
            { id: 28, name: 'ChambreCoffre', position: { x: 700, y: 450 }, isEnigma: true }
          ],
          clues: ["Trouvez les chiffres cachés dans les objets et additionnez-les pour ouvrir le coffre."]
        }
      ],
      selectedScreen: null,
      showDoorImage: false,
      doorImage: require('@/assets/femme.png'),
      penaltyPerClue: 50,
      penaltyPerSecond: 1
    };
  },
  mounted() {
    if (this.$route.query.load) {
      this.isLoadingProgress = true;
      this.loadProgress(); // Charger la progression
    } else {
      this.playAudio(); // Jouer l'audio seulement si aucune progression n'est chargée
      setTimeout(() => {
        this.showOverlay = false;
        this.showButton = true;
      }, 18000); // Conserver le délai pour l'affichage de l'overlay et du bouton
    }
  },
  methods: {
    handleCoffreEnigmaChambre() {
      const userAnswer = prompt("Entrez le code à trois chiffres pour ouvrir le coffre :");
      if (userAnswer && userAnswer === "26") {
        alert("Bravo ! Vous avez résolu l'énigme. Le coffre s'ouvre et vous trouvez une clé.");
        const key = { id: 1004, name: 'Clé de la salle suivante', effect: 'Ouvre la porte de la salle suivante' };
        if (!this.inventory.some(item => item.id === key.id)) {
          this.inventory.push(key);
        }

        // Débloquer la salle suivante (par exemple, la salle 10)
        const salleSuivante = this.screens.find(screen => screen.id === 10);
        if (salleSuivante) {
          salleSuivante.isLocked = false;
          alert("La salle suivante est maintenant déverrouillée.");
        }
      } else {
        alert("Code incorrect. Essayez encore !");
      }
    },
    handleBaignoireAudioEnd() {
      // Ajouter le médaillon à l'inventaire avec une clé
      const medaillon = { 
        id: 1002, 
        name: 'Médaillon', 
        effect: 'Un médaillon ancien et rouillé contenant une clé', 
        hasKey: true // Propriété pour indiquer que le médaillon contient une clé
      };
      if (!this.inventory.some(item => item.id === medaillon.id)) {
        this.inventory.push(medaillon);
        alert("La baignoire a été vidée. Vous avez trouvé un médaillon au fond de celle-ci.");
      } else {
        alert("Vous avez déjà ce médaillon.");
      }
    },
    handleCoffreEnigma() {
      const userAnswer = prompt("Entrez le code à trois chiffres pour ouvrir le coffre :");
      if (userAnswer && userAnswer === "26") {
        alert("Bravo ! Vous avez résolu l'énigme. Le coffre s'ouvre et vous trouvez une clé.");
        const key = { id: 1003, name: 'Clé de la chambre', effect: 'Ouvre la porte de la chambre' };
        if (!this.inventory.some(item => item.id === key.id)) {
          this.inventory.push(key);
        }

        // Débloquer la salle suivante (chambre)
        const chambre = this.screens.find(screen => screen.id === 9);
        if (chambre) {
          chambre.isLocked = false;
          alert("La chambre est maintenant déverrouillée.");
        }
      } else {
        alert("Code incorrect. Essayez encore !");
      }
    },
    closeRepasImage() {
      this.showRepasImage = false; // Masquer l'image repas.png
    },
    closeMedaillonImage() {
      this.showMedaillonImage = false; // Masquer l'image medaillon.png
    },
    playAudio() {
      if (this.isLoadingProgress) return; // Ne pas jouer l'audio si une progression est en cours de chargement
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

      // Réinitialiser le timer si nécessaire
      if (this.currentTimer <= 0) {
        this.currentTimer = this.initialTime;
      }

      this.startScoreCountdown();
    },
    selectScreen(screenId) {
      const screen = this.screens.find(screen => screen.id === screenId);
      if (screen.isLocked) {
        alert("Cette pièce est verrouillée. Résolvez l'énigme de la pièce précédente pour y accéder.");
      } else {
        this.selectedScreen = screenId;
      }
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
    closeDoor() {
      this.showDoorImage = false;
      const audio1 = this.$refs.doorAudio;
      const audio2 = this.$refs.door2Audio;
      if (audio1) {
        audio1.pause();
      }
      if (audio2) {
        audio2.pause();
      }
    },
    showEnigma() {
      const enigmaText = `
        Énigme : 
        "Je suis toujours devant toi, mais tu ne peux jamais me toucher.
        Je suis invisible, mais je peux te guider.
        Je suis le début de la fin, et la fin de chaque lieu.
        Qui suis-je ?"
      `;
      const userAnswer = prompt(enigmaText);

      if (userAnswer && userAnswer.toLowerCase() === "l'avenir") {
        alert("Bravo ! Vous avez résolu l'énigme. Une clé apparaît dans votre inventaire.");
        this.inventory.push({ id: 999, name: 'Clé mystérieuse', effect: 'Ouvre un passage secret' });
        this.currentScore += 500; // Ajouter 500 points pour la résolution de l'énigme

        // Débloquer la pièce 2 (galerie)
        const galerie = this.screens.find(screen => screen.id === 2);
        if (galerie) {
          galerie.isLocked = false;
        }
      } else {
        alert("Réponse incorrecte. Essayez encore !");
      }
    },
    showGalerieEnigma() {
      const enigmaText = `
        Énigme : 
        "L'âge est votre bouée de sauvetage.

        Trouvez ce code et entrez-le pour déverrouiller la porte."
      `;
      const userAnswer = prompt(enigmaText);

      if (userAnswer && userAnswer === "99") {
        alert("Bravo ! Vous avez résolu l'énigme. La porte est maintenant déverrouillée.");
        this.inventory.push({ id: 1000, name: 'Code secret', effect: 'Ouvre la porte 2 de la salle de contrôle' });
        this.currentScore += 1000; // Ajouter 1000 points pour la résolution de l'énigme

        // Débloquer la salle 3 (cuisine)
        const cuisine = this.screens.find(screen => screen.id === 3);
        if (cuisine) {
          cuisine.isLocked = false;
        }
      } else {
        alert("Réponse incorrecte. Essayez encore !");
      }
    },
    interactWithObject(object) {
      if (object.name === 'Porte1') {
        this.showDoorImage = true;
        this.doorImage = require('@/assets/femme.png');
        const audio = this.$refs.doorAudio;
        if (audio) {
          audio.play();
        }

        setTimeout(() => {
          this.closeDoor();
        }, 6000);
      } else if (object.name === 'Porte2') {
        const hasCode = this.inventory.some(item => item.name === 'Code secret');
        if (hasCode) {
          alert("Vous utilisez le code secret pour ouvrir la porte 2 de la salle de contrôle.");
          this.showDoorImage = true;
          this.doorImage = require('@/assets/cave.jpeg');
          const audio = this.$refs.door2Audio;
          if (audio) {
            audio.play();
          }

          setTimeout(() => {
            this.closeDoor();
          }, 8000);
        } else {
          alert("Cette porte est verrouillée. Trouvez le code secret dans la galerie.");
        }
      } else if (object.name === 'Livre' && object.isEnigma) {
        this.showEnigma();
      } else if (object.name === 'Couloir') {
        this.showGalerieEnigma();
      } else if (object.name === 'Tableau' || object.name === 'Vase' || object.name === 'Table basse' || object.name === 'ChambreHorloge' || object.name === 'ChambreTableau' || object.name === 'ChambreLit') {
        alert(object.clue); // Afficher l'indice de l'objet
      } else if (object.isUseless) {
        alert("Vous n'avez rien trouvé grâce à cet objet.");
      } else if (object.name === 'Porte') {
        alert("Vous avez réussi à sortir du manoir ! Votre score final est : " + this.currentScore);
        this.saveProgress();
        this.$router.push('/lobby');
      } else if (object.name.startsWith('T')) {
        alert(`Ce tableau représente un personnage âgé de ${object.age} ans.`);
      } else if (object.name === 'Tiroir') {
        const key = { id: 1001, name: 'Clé de la porte', effect: 'Ouvre la porte de l\'entrée' };
        if (!this.inventory.some(item => item.id === key.id)) {
          this.inventory.push(key);
          alert("Vous avez trouvé une clé dans le tiroir !");
        } else {
          alert("Vous avez déjà cette clé.");
        }
      } else if (object.name === 'Assiette') {
        alert("Retrouvez l'heure du dernier repas.");
      } else if (object.name === 'Armoire') {
        this.showRepasImage = true;
      } else if (object.name === 'horloge') {
        const userAnswer = prompt("Entrez l'heure du dernier repas (format XXh) :");
        if (userAnswer && userAnswer.toLowerCase() === '20h') {
          alert("Bravo ! Vous avez résolu l'énigme. La salle à manger est maintenant déverrouillée.");
          this.currentScore += 1000;

          // Débloquer la salle suivante (si nécessaire)
          const salleSuivante = this.screens.find(screen => screen.id === 7);
          if (salleSuivante) {
            salleSuivante.isLocked = false;
          }
        } else {
          alert("Réponse incorrecte. Essayez encore !");
        }
      } else if (object.name === 'Miroir') {
        alert("L’eau est sombre. En y plongeant la main, vous sentez un objet métallique : un médaillon rouillé. Il est bloqué… Il faut vider l’eau pour le récupérer.");
      } else if (object.name === 'Medaillon') {
        this.showMedaillonImage = true; // Afficher l'image medaillon.png
      } else if (object.name === 'Baignoire') {
        const audio = this.$refs.baignoireAudio;
        if (audio) {
          audio.play(); // Jouer le son de la baignoire
        }
      } else if (object.name === 'Coffre') {
        this.handleCoffreEnigma();
      } else if (object.name === 'ChambreCoffre') {
        this.handleCoffreEnigmaChambre();
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
    useItem(item) {
      if (item.name === 'Clé de la porte') {
        // Déverrouiller la pièce 4 (Entrée)
        const entree = this.screens.find(screen => screen.id === 4);
        if (entree) {
          entree.isLocked = false;
          alert("Vous avez utilisé la clé pour déverrouiller l'entrée.");
          this.inventory = this.inventory.filter(i => i.id !== item.id); // Retirer la clé de l'inventaire
        }
      } else if (item.name === 'Médaillon') {
        this.showMedaillonImage = true; // Afficher l'image medaillon.png
      } else {
        alert(`Vous avez utilisé : ${item.name}`);
      }
    },
    handleMedaillonClick() {
      // Vérifier si le médaillon contient une clé
      const medaillon = this.inventory.find(item => item.name === 'Médaillon' && item.hasKey);
      if (medaillon) {
        alert("Vous avez trouvé une clé cachée dans le médaillon ! Elle vous permet d'accéder à la salle suivante.");

        // Débloquer la salle suivante (par exemple, la salle 8)
        const salleSuivante = this.screens.find(screen => screen.id === 8);
        if (salleSuivante) {
          salleSuivante.isLocked = false;
          alert("La salle suivante est maintenant déverrouillée.");
        }

        // Retirer la clé du médaillon (optionnel)
        medaillon.hasKey = false;
      } else {
        alert("Le médaillon ne contient plus de clé.");
      }
    },
    exitGame() {
      if (confirm('Voulez-vous vraiment quitter le jeu ?')) {
        this.saveProgress();
        this.$router.push('/');
      }
    },
    pauseGame() {
      alert('Jeu en pause');
    },
    getCluesForScreen(screenId) {
      const screen = this.screens.find(screen => screen.id === screenId);
      return screen ? screen.clues : [];
    },
    showNextClue() {
      if (this.selectedScreen && this.getCluesForScreen(this.selectedScreen).length > 0) {
        const clue = this.getCluesForScreen(this.selectedScreen).shift();
        alert(clue); // Afficher l'indice
        this.currentScore -= this.penaltyPerClue; // Retirer des points pour l'utilisation d'un indice
      } else {
        alert("Il n'y a pas d'indices disponibles dans cette pièce.");
      }
    },
    startScoreCountdown() {
      if (!this.timerStarted) return;
      const interval = setInterval(() => {
        if (this.timerStarted && this.currentTimer > 0) {
          this.currentTimer--; // Décrémenter currentTimer
        } else {
          clearInterval(interval);
          if (this.currentTimer <= 0) {
            this.handleTimeUp(); // Appeler handleTimeUp lorsque le temps est écoulé
          }
        }
      }, 1000);
    },
    handleTimeUp() {
      alert("Le temps est écoulé ! Votre score final est : " + this.currentScore);
    },
    saveProgress() {
      const progress = {
        inventory: this.inventory,
        currentScore: this.currentScore,
        selectedScreen: this.selectedScreen,
        screens: this.screens,
        cluesFound: this.cluesFound,
        timerStarted: this.timerStarted,
        gameStarted: this.gameStarted,
        currentTimer: this.currentTimer // Assurez-vous que cette ligne est présente
      };
      axios.post('http://localhost:3001/api/saveProgress', {
        username: this.$store.getters.getUsername,
        scenario: 'manoir-du-mal',
        progress: JSON.stringify(progress)
      }).then(response => {
        if (response.data.success) {
          alert('Progression sauvegardée avec succès');
        } else {
          alert('Erreur lors de la sauvegarde de la progression');
        }
      });
    },
    loadProgress() {
      axios.get('http://localhost:3001/api/loadProgress', {
        params: { username: this.$store.getters.getUsername, scenario: 'manoir-du-mal' }
      }).then(response => {
        if (response.data.success) {
          const progress = JSON.parse(response.data.progress);
          this.inventory = progress.inventory;
          this.currentScore = progress.currentScore;
          this.selectedScreen = progress.selectedScreen;
          this.screens = progress.screens;
          this.cluesFound = progress.cluesFound;
          this.timerStarted = progress.timerStarted;
          this.gameStarted = progress.gameStarted;
          this.currentTimer = progress.currentTimer; // Assurez-vous que cette ligne est présente

          // Démarrer le jeu automatiquement après le chargement de la progression
          this.showOverlay = false;
          this.showButton = false;
          this.timerStarted = true;
          this.gameStarted = true;

          // Démarrer le timer avec la valeur sauvegardée
          this.startScoreCountdown();

          alert('Progression chargée avec succès');
        } else {
          alert('Aucune progression trouvée');
        }
      }).finally(() => {
        this.isLoadingProgress = false; // Fin du chargement
      });
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
  margin-left: 9vw;
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

.repas-image-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.repas-image-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.repas-image {
  max-width: 80%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4500;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background: #cc3700;
}

.medaillon-image-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.medaillon-image-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.medaillon-image {
  max-width: 80%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4500;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background: #cc3700;
}
</style>