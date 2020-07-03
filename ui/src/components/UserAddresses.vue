<template>
  <div class="myAddresses">
    <div v-show="isMyAddressesAreaVisible === 'true'" class="personalizeDataBlock">
      <a href="javascript:void(0);" class="personalizeDataBlockClose" @click="toggleMyAddressesAreaState"><i class="fas fa-times-circle"></i> Hide</a>
      <div v-if="addresses.length === 0">
        <p class="userStakesTitle">Enter your Polkadot stash address to see your stake distribution</p>
        <form action="/" class="personalizeDataForm" @submit.prevent="add">
          <input type="text" v-model="input" class="delegateAddressField" />
          <button type="submit">Add</button>
        </form>
      </div>
      <div v-else>
        <p class="userStakesTitle">My addresses</p>
        <div class="addressesList">
          <div v-for="address in addresses" v-bind:key="address.address" class="addressesListItem">
            <p>
              <span v-if="$w.width > 564">{{ address.address }}</span>
              <span v-else>{{ $h.minimizeString(address.address, 10) }}</span>
              <span class="toggleMyDelegatorAddressStatus" :class="{ enabled: address.enabled }" @click="toggleAddressState(address.address)"><i class="fas fa-circle"></i></span>
              <a href="javascript:void(0);" @click="remove(address.address)"><i class="fas fa-trash"></i></a>
            </p>
          </div>
        </div>
        <form action="/" class="personalizeDataForm" @submit.prevent="add">
          <input type="text" v-model="input" class="delegateAddressField" />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
    <div v-show="isMyAddressesAreaVisible === 'false'" class="personalizeDataBlock hidden">
      <a href="javascript:void(0);" class="personalizeDataBlockClose" @click="toggleMyAddressesAreaState"><i class="far fa-eye"></i> Show</a>
      <div v-if="addresses.length === 0">
        <p class="userStakesTitle">Enter your Polkadot stash address to see your stake distribution</p>
      </div>
      <div v-else>
        <p class="userStakesTitle" v-if="addresses.length === 1">{{ addresses.length }} address added</p>
        <p class="userStakesTitle" v-else>{{ addresses.length }} addresses added</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

  data() {
    return {
      isMyAddressesAreaVisible: '',
      input: ''
    };
  },

  computed: {
    ...mapGetters({
      $w: '$w',
      addresses: 'user/addresses'
    })
  },

  methods: {

    toggleMyAddressesAreaState() {
      if (this.isMyAddressesAreaVisible === 'true') {
        this.isMyAddressesAreaVisible = 'false';
        localStorage.setItem('isMyAddressesAreaVisible', 'false');
      } else {
        this.isMyAddressesAreaVisible = 'true';
        localStorage.setItem('isMyAddressesAreaVisible', 'true');
      }
    },

    add() {
      const address = this.input.trim();

      if (address !== '') {
        this.$store.dispatch('user/updateAddresses', [...this.addresses, {
          address,
          enabled: true,
          alias: ''
        }]);
      }

      this.input = '';
      this.$store.dispatch('user/getUserStakes');
    },

    remove(address) {
      const addresses = this.addresses.filter((a) => a.address !== address);
      this.$store.dispatch('user/updateAddresses', addresses);
      this.$store.dispatch('user/getUserStakes');
    },

    toggleAddressState(address) {
      const addresses = [...this.addresses].map((a) => ({
        address: a.address,
        enabled: (a.address === address) ? !a.enabled : a.enabled,
        alias: a.alias
      }));

      this.$store.dispatch('user/updateAddresses', addresses);
      this.$store.dispatch('user/getUserStakes');
    }

  },

  mounted() {
    if (localStorage.getItem('isMyAddressesAreaVisible') === null) {
      localStorage.setItem('isMyAddressesAreaVisible', 'true');
    }
    this.isMyAddressesAreaVisible = localStorage.getItem('isMyAddressesAreaVisible');
  }

};
</script>
