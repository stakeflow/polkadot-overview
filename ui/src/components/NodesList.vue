<template>
  <div class="candidatesOverviewContent">
    <div v-if="nodesSorted.length === 0" class="loadingMessage"><img src="/loading.gif" /><span>LOADING</span></div>
    <div v-else class="nodesList">
      <div v-if="['sm', 'md', 'lg'].includes(responsiveClass)" class="cards">
        <ul>
          <li v-for="(node, index) in nodesSorted" v-bind:key="index">
            <div class="left">
              <p class="rank">{{ index + 1 }}</p>
              <a v-show="showDetailsNodesList.includes(node.stashAddress)" href="javascript:void(0);" class="inlineDetails" @click="showDetails(node)"><i class="fas fa-caret-up"></i></a>
              <a v-show="!showDetailsNodesList.includes(node.stashAddress)" href="javascript:void(0);" class="inlineDetails" @click="showDetails(node)"><i class="fas fa-caret-down"></i></a>
            </div>
            <div class="right">
              <div class="row">
                <div class="nodeName">
                  <img v-if="node.icon !== undefined && node.icon.trim() !== ''" :src="`data:image/png;base64, ${node.icon}`" class="nodeIcon" alt=""/>
                  <identicon
                    v-else
                    class="nodeIcon"
                    :size="32"
                    :theme="'polkadot'"
                    :value="node.stashAddress"
                  />
                  <div class="group">
                    <p v-if="node.info !== undefined && node.info.display !== undefined" class="name">{{ hexToString(node.info.display) }}</p>
                    <p v-else class="name">{{ $h.minimizeString(node.stashAddress, 5) }}</p>
                    <p class="nodeStatus" :class="$h.getNodeStatusClass(node.status)">
                      <i class="fas fa-circle"></i> {{ $h.getNodeStatusText(node.status) }}
                    </p>
                  </div>
                </div>
                <div class="links">
                  <router-link :to="`/validators/${node.stashAddress}`" class="profileLink" :class="{ iconOnly: $w.width <= 377 }"><i class="fas fa-user"></i><span v-show="$w.width > 377"> Profile</span></router-link>
                </div>
              </div>

              <div class="summary" v-show="!showDetailsNodesList.includes(node.stashAddress)" :class="{ fourItems: $w.width > 450 }">
                <div class="summaryItem">
                  <p class="summaryTitle">Total Stake</p>
                  <p class="summaryValue">{{ $h.formatNumber($h.convert(node.stakeTotal), 2) }} <span class="pale">DOT</span></p>
                </div>
                <div class="summaryItem">
                  <p class="summaryTitle">Fee</p>
                  <p class="summaryValue">{{ node.commission }}%</p>
                </div>
                <div class="summaryItem">
                  <p class="summaryTitle">Nominators</p>
                  <p class="summaryValue">{{ node.nominators.length }}</p>
                </div>
                <div class="summaryItem" v-show="$w.width > 450">
                  <p class="summaryTitle">Self-Nominated</p>
                  <p class="summaryValue">{{ $h.formatNumber($h.convert(node.stakeOwn), 2) }} <span class="pale">DOT</span></p>
                </div>
                <div class="summaryItem" v-show="$w.width > 620">
                  <p class="summaryTitle">Era Points</p>
                  <p class="summaryValue">{{ node.points }}</p>
                </div>
                <div class="summaryItem myStakeSummaryItem" v-show="$w.width > 700">
                  <p class="summaryTitle">My Stake</p>
                  <p class="summaryValue" v-if="userStakes[node.stashAddress] !== undefined && userStakes[node.stashAddress] !== '0'">{{ $h.formatNumber($h.convert(userStakes[node.stashAddress]), 2) }} <span class="pale">DOT</span></p>
                  <p class="summaryValue" v-else>-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                </div>
              </div>

              <div class="details" v-show="showDetailsNodesList.includes(node.stashAddress)">
                <div class="detailsBlock">
                  <p class="blockTitle">Account Info</p>
                  <div class="item">
                    <p class="itemTitle">Control Address</p>
                    <p class="itemValue">{{ $h.minimizeString(node.controlAddress, 7) }}</p>
                  </div>
                  <div class="item">
                    <p class="itemTitle">Stash Address</p>
                    <p class="itemValue">{{ $h.minimizeString(node.stashAddress, 7) }}</p>
                  </div>
                  <div class="item">
                    <p class="itemTitle">Commission</p>
                    <p class="itemValue">{{ node.commission }}%</p>
                  </div>
                </div>

                <div class="detailsBlock">
                  <p class="blockTitle">Staking</p>
                  <div class="item">
                    <p class="itemTitle">Total Stake</p>
                    <p class="itemValue">{{ $h.formatNumber($h.convert(node.stakeTotal), 2) }} <span class="pale">DOT</span></p>
                  </div>
                  <div class="item">
                    <p class="itemTitle">Self-Nominated</p>
                    <p class="itemValue">{{ $h.formatNumber($h.convert(node.stakeOwn), 2) }} <span class="pale">DOT</span></p>
                  </div>
                  <div class="item myStake" v-if="userStakes[node.stashAddress] !== undefined && userStakes[node.stashAddress] !== '0'">
                    <p class="itemTitle">My Stake</p>
                    <p class="itemValue">{{ $h.formatNumber($h.convert(userStakes[node.stashAddress]), 2) }} <span class="pale">DOT</span></p>
                  </div>
                  <div class="item">
                    <p class="itemTitle">Era points</p>
                    <p class="itemValue">{{ node.points }}</p>
                  </div>
                </div>

                <div class="detailsBlock">
                  <p class="blockTitle">Identity</p>
                  <div class="identityBlock"  v-if="node.info !== undefined && Object.keys(getNodeIdentityBlockData(node)).length > 0">
                    <div class="item" v-for="(value, identity) in getNodeIdentityBlockData(node)" :class="identity" v-bind:key="identity">
                      <p v-if="identity === 'web'" class="itemTitle"><i class="fas fa-link"></i> {{ identity.charAt(0).toUpperCase() + identity.slice(1) }}</p>
                      <p v-else-if="identity === 'email'" class="itemTitle"><i class="fas fa-at"></i> {{ identity.charAt(0).toUpperCase() + identity.slice(1) }}</p>
                      <p v-else-if="identity === 'twitter'" class="itemTitle"><i class="fab fa-twitter"></i> {{ identity.charAt(0).toUpperCase() + identity.slice(1) }}</p>
                      <p v-else class="itemTitle">{{ identity.charAt(0).toUpperCase() + identity.slice(1) }}</p>

                      <p class="itemValue">
                        <a v-if="identity === 'web'" :href="hexToString(value)" target="_blank" class="identityValue">{{ hexToString(value) }}</a>
                        <a v-else-if="identity === 'email'" :href="`mailto:${hexToString(value)}`" class="identityValue">{{ hexToString(value) }}</a>
                        <a v-else-if="identity === 'twitter'" :href="`https://twitter.com/${hexToString(value)}`" target="_blank" class="identityValue">{{ hexToString(value) }}</a>
                        <span v-else class="identityValue">{{ hexToString(value) }}</span>
                      </p>
                    </div>
                  </div>
                  <div v-else class="identityBlock">
                    <p class="noIdentity">-</p>
                  </div>
                </div>

                <div class="detailsBlock">
                  <p class="blockTitle">Stability</p>
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
              </div>
            </div>
          </li>
        </ul>
      </div>
      <table v-else class="overviewTable">
        <thead>
        <tr>
          <th>&nbsp;</th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'stashAddress')"><i class="fas fa-sort"></i> Node</a></th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'status')"><i class="fas fa-sort"></i> Status</a></th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'fee')"><i class="fas fa-sort"></i> Fee</a></th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'stakeTotal')"><i class="fas fa-sort"></i> Total Stake</a></th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'stakeTotal')"><i class="fas fa-sort"></i> Self-Nominated</a></th>
          <th v-if="Object.keys(userStakes).length > 0" class="myStakeCol"><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'userStakes')"><i class="fas fa-sort"></i> My Stake</a></th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'stability')"><i class="fas fa-sort"></i> Stability</a></th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'nominatorsCount')"><i class="fas fa-sort"></i> Nominators</a></th>
          <th><a href="javascript:void(0);" @click="$store.commit('nodes/UPDATE_SORTING', 'points')"><i class="fas fa-sort"></i> Era Points</a></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(node, index) in nodesSorted" v-bind:key="index" @click="openProfile(node)">
          <td class="delegateIndex">{{ index + 1 }}</td>
          <td class="nodeInfo">
            <router-link :to="`/validators/${node.stashAddress}`">
              <img v-if="node.icon !== undefined && node.icon.trim() !== ''" :src="`data:image/png;base64, ${node.icon}`" class="nodeIcon" alt=""/>
              <identicon
                v-else
                class="nodeIcon"
                :size="32"
                :theme="'polkadot'"
                :value="node.stashAddress"
              />
            </router-link>
            <router-link :to="`/validators/${node.stashAddress}`" v-if="node.info !== undefined && node.info.display !== undefined" :href="node.stashAddress" class="nameLink">{{ hexToString(node.info.display) }}</router-link>
            <router-link :to="`/validators/${node.stashAddress}`" v-else class="nameLink">-</router-link>
            <router-link :to="`/validators/${node.stashAddress}`" class="stashLink">{{ $h.minimizeString(node.stashAddress, 7) }}</router-link>
          </td>
          <td class="nodeStatus" :class="$h.getNodeStatusClass(node.status)"><i class="fas fa-circle"></i> {{ $h.getNodeStatusText(node.status) }}</td>
          <td>{{ node.commission }}%</td>
          <td>
            <p class="totalStake">{{ $h.formatNumber($h.convert(node.stakeTotal), 2) }} <span class="pale">DOT</span></p>
            <p v-show="node.stakeDelta !== undefined && node.stakeDelta !== '0'" class="stakeDelta" :class="{ negative: node.stakeDelta < 0 }"><span v-show="node.stakeDelta > 0">+ </span>{{ $h.formatNumber($h.convert(node.stakeDelta), 2) }} DOT</p>
          </td>
          <td>
            <p class="totalStake">{{ $h.formatNumber($h.convert(node.stakeOwn), 2) }} <span class="pale">DOT</span></p>
          </td>
          <td v-if="Object.keys(userStakes).length > 0" class="myStakeCol">
            <span v-if="userStakes[node.stashAddress] !== undefined && userStakes[node.stashAddress] !== '0'">{{ $h.formatNumber($h.convert(userStakes[node.stashAddress]), 2) }} <span class="pale">DOT</span></span>
            <span v-else>-</span>
          </td>

          <td class="stabilityCell">
            <p v-if="node.nextSessionElected" class="stabilityItem nextSessionElected" title="Elected for the next session">
              <i class="fas fa-check-circle"></i>
            </p>
            <p v-else class="stabilityItem off" title="Not elected for the next session">
              <i class="fas fa-check-circle"></i>
            </p>

            <p v-if="node.authoredBlocks === 1" class="stabilityItem authoredBlocks" :title="`${node.authoredBlocks} block authored`">
              <i class="fas fa-cube"></i> <span>{{ node.authoredBlocks }}</span>
            </p>
            <p v-else-if="node.authoredBlocks > 1" class="stabilityItem authoredBlocks" :title="`${node.authoredBlocks} blocks authored`">
              <i class="fas fa-cube"></i> <span>{{ node.authoredBlocks }}</span>
            </p>
            <p v-else class="stabilityItem off" title="No blocks authored yet">
              <i class="fas fa-cube"></i> <span>0</span>
            </p>

            <p v-if="node.heartbeats" class="stabilityItem heartbeats" title="Heartbeat message received">
              <i class="fas fa-heartbeat"></i>
            </p>
            <p v-else class="stabilityItem off" title="No heartbeat message">
              <i class="fas fa-heartbeat"></i>
            </p>

            <p v-if="node.downTimeSlashCounter84Eras === 1" class="stabilityItem downTimeSlashCounter84Eras" :title="`${node.downTimeSlashCounter84Eras} slash event in the last 84 eras`">
              <i class="fab fa-gripfire"></i> <span>{{ node.downTimeSlashCounter84Eras }}</span>
            </p>
            <p v-else-if="node.downTimeSlashCounter84Eras > 1" class="stabilityItem downTimeSlashCounter84Eras" :title="`${node.downTimeSlashCounter84Eras} slash events in the last 84 eras`">
              <i class="fab fa-gripfire"></i> <span>{{ node.downTimeSlashCounter84Eras }}</span>
            </p>
            <p v-else class="stabilityItem off downTimeSlashCounter84Eras" title="No slashes in the last 84 eras">
              <i class="fab fa-gripfire"></i> <span>-</span>
            </p>
          </td>
          <td class="nominatorsCell">
            <p>{{ node.nominators.length }}</p>
          </td>
          <td class="pointsCell">
            <p>{{ node.points }}</p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { hexToString } from '@polkadot/util';
import Identicon from '@polkadot/vue-identicon';
import { mapGetters } from 'vuex';

export default {

  components: {
    Identicon
  },

  data() {
    return {
      hexToString,
      showDetailsNodesList: []
    };
  },

  computed: {
    ...mapGetters({
      $w: '$w',
      responsiveClass: 'responsiveClass',
      nodesSorted: 'nodes/nodesSorted',
      userStakes: 'user/userStakes'
    })
  },

  methods: {
    getNodeIdentityBlockData(node) {
      const data = {};
      if (this.node !== null) {
        Object.keys(node.info).forEach((identity) => {
          if (identity !== 'display' && identity !== 'image') {
            data[identity] = node.info[identity];
          }
        });
      }
      return data;
    },
    showDetails(node) {
      if (!this.showDetailsNodesList.includes(node.stashAddress)) {
        this.showDetailsNodesList.push(node.stashAddress);
      } else {
        const index = this.showDetailsNodesList.indexOf(node.stashAddress);
        if (index !== -1) this.showDetailsNodesList.splice(index, 1);
      }
    },
    openProfile(node) {
      this.$router.push({
        path: `/validators/${node.stashAddress}`
      });
    }
  }

};
</script>
