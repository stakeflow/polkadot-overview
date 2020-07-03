<template>
  <div class="networkData">
    <div class="networkDataItem validatorsNumber">
      <p class="title">Validators</p>
      <p v-if="appState.activeValidators !== undefined" class="data">{{ appState.activeValidators }} / {{ appState.validatorSlots }}</p>
      <p class="data" v-else>-</p>
    </div>
    <div class="networkDataItem candidatesNumber">
      <p class="title">Candidates</p>
      <p class="data" v-if="appState.candidates !== undefined">{{ $h.formatNumber(appState.candidates, 0) }}</p>
      <p class="data" v-else>-</p>
    </div>
    <div class="networkDataItem latestBlock">
      <p class="title">Latest Block</p>
      <p class="data" v-if="appState.block !== undefined">{{ $h.formatNumber(appState.block, 0) }}</p>
      <p class="data" v-else>-</p>
    </div>
    <div class="networkDataItem session">
      <p class="title">Session</p>
      <p class="data" v-if="appState.sessionIndex !== undefined">{{ $h.formatNumber(appState.sessionIndex, 0) }}</p>
      <p class="data" v-else>-</p>
    </div>
    <div class="networkDataItem era">
      <p class="title">Era</p>
      <p class="data" v-if="appState.activeEra !== undefined">{{ $h.formatNumber(appState.activeEra, 0) }}</p>
      <p class="data" v-else>-</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

  computed: {
    ...mapGetters({
      appState: 'app/appState'
    })
  }

};

</script>
