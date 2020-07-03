<template>
  <div class="container">
    <p v-if="appState.isSyncing === true" class="outOfSyncMessage"><i class="fas fa-exclamation-circle"></i> Polkadot node is out of sync</p>
    <div v-else>
      <UserAddresses />
      <div v-if="node === null" class="loadingMessage"><img src="/loading.gif" /><span>LOADING</span></div>
      <div v-else class="section nodeProfile">
        <div class="nodeName">
          <img
            v-if="node.icon !== undefined && node.icon.trim() !== ''"
            :src="`data:image/png;base64, ${node.icon}`"
            class="nodeIcon"
          />
          <identicon
            v-else
            class="nodeIcon"
            :size="32"
            :theme="'polkadot'"
            :value="node.stashAddress"
          />
          <h1 v-if="node.info !== undefined && node.info.display !== undefined">{{ hexToString(node.info.display) }}</h1>
          <h1 v-else>{{ node.stashAddress }}</h1>
        </div>

        <div class="profileLayout">
          <div class="left">
            <div class="block account">
              <h3>Account Info</h3>
              <table class="nodeParametersTable">
                <tr>
                  <td>Control Address</td>
                  <td v-if="$w.width < 576">{{ $h.minimizeString(node.controlAddress, 7) }}</td>
                  <td v-else>{{ node.controlAddress }}</td>
                </tr>
                <tr>
                  <td>Stash Address</td>
                  <td v-if="$w.width < 576">{{ $h.minimizeString(node.stashAddress, 7) }}</td>
                  <td v-else>{{ node.stashAddress }}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td class="nodeStatus" :class="$h.getNodeStatusClass(node.status)">
                    <i class="fas fa-circle"></i>
                    {{ $h.getNodeStatusText(node.status) }}
                  </td>
                </tr>
                <tr>
                  <td>Commission</td>
                  <td>{{ node.commission }}%</td>
                </tr>
              </table>
            </div>

            <div class="block stake">
              <h3>Stake</h3>
              <table class="nodeParametersTable">
                <tr>
                  <td>Total Stake</td>
                  <td>
                    {{ $h.formatNumber($h.convert(node.stakeTotal), 2) }}
                    <span class="pale">DOT</span>
                  </td>
                </tr>
                <tr>
                  <td>Self-Nominated</td>
                  <td>{{ $h.formatNumber($h.convert(node.stakeOwn), 2) }} <span class="pale">DOT</span></td>
                </tr>
                <tr v-if="Object.keys(userStakes).length > 0">
                  <td>My Stake</td>
                  <td>
                    <span v-if="userStakes[node.stashAddress] !== undefined && userStakes[node.stashAddress] !== '0'">{{ $h.formatNumber($h.convert(userStakes[node.stashAddress]), 2) }} <span class="pale">DOT</span></span>
                    <span v-else>-</span>
                  </td>
                </tr>
              </table>
            </div>

            <div class="block points" v-if="node.historicalData.points.length > 0">
              <h3>Points / Era</h3>
              <PointsChart :node="node" />
            </div>

            <div class="block nominators">
              <h3>Nominators</h3>
              <table class="nodeParametersTable">
                <tr v-for="(nominator) in node.nominators" v-bind:key="nominator.address">
                  <td v-if="$w.width < 576" class="nominatorName">
                    <identicon class="nodeIcon" :size="24" :theme="'polkadot'" :value="nominator.address" />
                    <p>{{ $h.minimizeString(nominator.address, 7) }}</p>
                  </td>
                  <td v-else class="nominatorName">
                    <identicon class="nodeIcon" :size="24" :theme="'polkadot'" :value="nominator.address" />
                    <p>{{ nominator.address }}</p>
                  </td>
                  <td>
                    {{ $h.formatNumber($h.convert(nominator.stake), 2) }} <span class="pale">DOT</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="right">
            <div class="block session">
              <h3>Stability</h3>
              <ul class="stability">
                <li>
                  <p v-if="node.nextSessionElected" class="stabilityItem nextSessionElected">
                    <i class="fas fa-check-circle"></i> <span>Elected for the next session</span>
                  </p>
                  <p v-else class="stabilityItem off">
                    <i class="fas fa-check-circle"></i> <span>Not elected for the next session</span>
                  </p>
                </li>
                <li>
                  <p v-if="node.authoredBlocks > 0" class="stabilityItem authoredBlocks">
                    <i class="fas fa-cube"></i>
                    <span v-if="node.authoredBlocks === 1">{{ node.authoredBlocks }} block authored</span>
                    <span v-if="node.authoredBlocks > 1">{{ node.authoredBlocks }} blocks authored</span>
                  </p>
                  <p v-else class="stabilityItem off">
                    <i class="fas fa-cube"></i>
                    <span>No blocks authored yet</span>
                  </p>
                </li>
                <li>
                  <p v-if="node.heartbeats" class="stabilityItem heartbeats">
                    <i class="fas fa-heartbeat"></i> <span>Heartbeat message received</span>
                  </p>
                  <p v-else class="stabilityItem off">
                    <i class="fas fa-heartbeat"></i> <span>No heartbeat message</span>
                  </p>
                </li>
                <li>
                  <p v-if="node.downTimeSlashCounter84Eras > 0" class="stabilityItem downTimeSlashCounter84Eras">
                    <i class="fab fa-gripfire"></i>
                    <span v-if="node.downTimeSlashCounter84Eras === 1">{{ node.downTimeSlashCounter84Eras }} slash event in the last 84 eras</span>
                    <span v-if="node.downTimeSlashCounter84Eras > 1">{{ node.downTimeSlashCounter84Eras }} slash events in the last 84 eras</span>
                  </p>
                  <p v-else class="stabilityItem downTimeSlashCounter84Eras off">
                    <i class="fab fa-gripfire"></i>
                    <span>No slashes in the last 84 eras</span>
                  </p>
                </li>
              </ul>
            </div>
            <div class="block identity">
              <h3>{{ $h.getNodeStatusText(node.status) }} Identity</h3>
              <ul v-if="node.info !== undefined && Object.keys(nodeIdentityBlockData).length > 0">
                <li v-for="(value, identity) in nodeIdentityBlockData" :class="identity" v-bind:key="identity">
                  <p v-if="identity === 'web'" class="identityName">
                    <i class="fas fa-link"></i>
                    {{ identity.charAt(0).toUpperCase() + identity.slice(1) }}
                  </p>
                  <p v-else-if="identity === 'email'" class="identityName">
                    <i class="fas fa-at"></i>
                    {{ identity.charAt(0).toUpperCase() + identity.slice(1) }}
                  </p>
                  <p v-else-if="identity === 'twitter'" class="identityName">
                    <i class="fab fa-twitter"></i>
                    {{ identity.charAt(0).toUpperCase() + identity.slice(1) }}
                  </p>
                  <p
                    v-else
                    class="identityName"
                  >{{ identity.charAt(0).toUpperCase() + identity.slice(1) }}</p>

                  <a
                    v-if="identity === 'web'"
                    :href="hexToString(value)"
                    target="_blank"
                    class="identityValue"
                  >{{ hexToString(value) }}</a>
                  <a
                    v-else-if="identity === 'email'"
                    :href="`mailto:${hexToString(value)}`"
                    class="identityValue"
                  >{{ hexToString(value) }}</a>
                  <a
                    v-else-if="identity === 'twitter'"
                    :href="`https://twitter.com/${hexToString(value)}`"
                    target="_blank"
                    class="identityValue"
                  >{{ hexToString(value) }}</a>
                  <p v-else class="identityValue">{{ hexToString(value) }}</p>
                </li>
              </ul>
              <ul v-else>
                <li>-</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hexToString } from '@polkadot/util';
import { mapGetters } from 'vuex';
import Identicon from '@polkadot/vue-identicon';
import UserAddresses from '../components/UserAddresses.vue';
import PointsChart from '../components/charts/PointsChart.vue';

export default {

  components: {
    Identicon,
    UserAddresses,
    PointsChart
  },

  data() {
    return {
      hexToString
    };
  },

  computed: {
    ...mapGetters({
      appState: 'app/appState',
      $w: '$w',
      node: 'nodes/node',
      userStakes: 'user/userStakes'
    }),
    nodeIdentityBlockData() {
      const data = {};
      if (this.node !== null) {
        Object.keys(this.node.info).forEach((identity) => {
          if (identity !== 'display' && identity !== 'image') {
            data[identity] = this.node.info[identity];
          }
        });
      }
      return data;
    }
  },

  mounted() {
    this.$store.dispatch('app/getAppStateLoop');
    this.$store.dispatch('user/initAddresses');
    this.$store.dispatch('user/getUserStakesLoop');
    this.$store.dispatch('nodes/getNodeLoop');
  }

};

</script>
