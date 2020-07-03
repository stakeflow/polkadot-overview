<template>
  <div id="app" :class="responsiveClass">
    <Header />
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Footer
  },

  computed: {
    ...mapGetters({
      responsiveClass: 'responsiveClass'
    })
  },

  mounted() {
    this.$store.dispatch('initResizeListener');
  }
};
</script>
