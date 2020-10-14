<template>
  <v-app>
    <v-card class="overflow-hidden">
      <v-app-bar outlined="true" color="black accent-4">
        <v-layout align-center justify-center>
          <v-flex full-width>
            <v-form>
              <v-container class="spacing-playground pt-10">
                <v-row fluid>
                  <v-col cols="auto">
                    <v-text-field label="Label" v-model="solaceLabel" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Host List" v-model="hostUrl" />
                  </v-col>
                  <v-col cols="auto">
                    <v-text-field label="Username" v-model="username" />
                  </v-col>
                  <v-col cols="auto">
                    <v-text-field label="Password" v-model="password" />
                  </v-col>
                  <v-col cols="auto">
                    <v-btn depressed color="primary" @click="connect"
                      >Connect</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-flex>
        </v-layout>
      </v-app-bar>
    </v-card>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex full-width>
            <v-form>
              <v-container class="spacing-playground pt-10">
                <v-row>
                  <v-col col="5">
                    <center>
                      <v-img
                        src="@/assets/logo.png"
                        height="50%"
                        width="50%"
                        position="center center"
                      />
                    </center>
                  </v-col>
                </v-row>
                <v-row fluid>
                  <v-col cols="11">
                    <v-text-field
                      label="Subscription List"
                      v-model="subscriptions"
                    />
                  </v-col>
                  <v-col cols="1">
                    <v-btn depressed color="primary" @click="subscribe"
                      >Subscribe</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row fluid>
                  <v-col cols="auto">
                    <h2>Messages Received: {{ messagesReceived }}</h2>
                    <br />
                    <span v-html="message"></span>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <v-card class="mx-auto" align-center justify-center>
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
export default {
  name: 'App',

  data: () => ({
    message: '',
    messagesReceived: 0,
    isMqttConnected: false,
    snackbarMessage: '',
    snackbarShow: false,
    solaceLabel: 'Scwab Nodes 1 & 2',
    subscriptions: '',
    hostUrl: 'mrthwc8w0ko9n.messaging.solace.cloud:8443',
    username: 'mqtt-client-failover',
    password: '1234'
  }),
  beforeDestroy() {
    this.$mqttClient.disconnect().then(() => {
      console.log('Succesfully disconnected')
    })
  },
  methods: {
    subscribe() {
      //Subscribe to the other player's move message
      this.subscriptions.split(',').forEach(subscription => {
        this.$mqttClient
          .subscribe(subscription, ({ topic, message }) => {
            this.messagesReceived++
            this.message = `<table border=1><tr><th>Topic: ${topic}</th></tr><tr><td>${JSON.stringify(
              message
            )}</td></tr></table>`
          })
          .then(() => {
            console.log('Succesfully subscribed')
          })
      })
    },

    connect() {
      this.$mqttClient
        .connect(this.hostUrl, this.username, this.password)
        .then(() => {
          this.isMqttConnected = true
          this.snackbarMessage = 'Succesfully connected to the broker'
          this.snackbarShow = true
        })
        .catch(err => {
          console.log('Unable to connect ' + err)
        })
    }
  }
}
</script>
