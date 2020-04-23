<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="mx-auto" align-center justify-center>
              <v-row>
                <v-col cols="12">
                  <v-img src="@/assets/logo.png" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-card-actions class="align-center justify-center">
                    <v-btn
                      rounded
                      color="primary"
                      dark
                      @click="makeMove"
                      :loading="isWaiting"
                      :disabled="isWaiting && !isMqttConnected"
                      >{{ player }} Move!</v-btn
                    >
                  </v-card-actions>
                </v-col>
              </v-row>
              <v-snackbar v-model="snackbarShow">
                {{ snackbarMessage }}
                <v-btn color="pink" text @click="snackbar = false">
                  Close
                </v-btn>
              </v-snackbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import store from '@/store'

export default {
  name: 'App',

  data: () => ({
    isMqttConnected: false,
    snackbarMessage: '',
    snackbarShow: false,
    isWaiting: true,
    player: 'Player1'
  }),
  created() {
    const playerParam = new URLSearchParams(window.location.search).get(
      'player'
    )

    if (playerParam && playerParam.toLowerCase() === 'player2') {
      this.player = 'Player2'
    }

    this.$mqttClient.connect().then(() => {
      store.dispatch('login', this.player)
      if (this.player === 'Player1') this.isWaiting = false
      this.isMqttConnected = true
      this.snackbarMessage = 'Succesfully connected to the broker'
      this.snackbarShow = true

      //Subscribe to the other player's move message
      this.$mqttClient
        .addEventHandler(
          (this.player === 'Player1' ? 'Player2' : 'Player1') + '/Move',
          ({ topic, message }) => {
            store.dispatch('receiveMove', message)
            this.snackbarMessage = `Received ${JSON.stringify(
              message
            )} on topic ${topic}`
            this.snackbarShow = true
            this.isWaiting = false
          }
        )
        .then(() => {
          console.log('Succesfully subscribed')
        })
    })
  },
  methods: {
    makeMove() {
      let move = { player: this.player, move: 'Hello World!' }
      store.dispatch('makeMove', move).then(() => {
        this.isWaiting = true
        this.snackbarMessage = 'Sent move to other player!'
        this.snackbarShow = true
      })
    }
  }
}
</script>
