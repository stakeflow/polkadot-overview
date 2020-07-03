<template>
  <footer class="section footer">
    <div class="container">
      <p>Polkadot Overview {{ appVersion }}</p>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

  computed: {
    ...mapGetters({
      appVersion: 'app/appVersion'
    })
  }

};
</script>
