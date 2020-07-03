import Vue from 'vue';
import _ from 'lodash';

export default {
  install: () => {
    Vue.prototype.$h = {
      convert: (pip) => _.round(pip / 1000000000000, 12),

      formatNumber: (number, precision = 18) => {
        const result = _.round(number, precision).toString().split('.');
        if (result[0].length >= 4) {
          result[0] = result[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
        }
        return result.join('.');
      },

      minimizeString: (input, chars) => `${input.substring(0, chars)}..${input.substring(input.length - chars)}`,

      getNodeStatusClass(statusCode) {
        switch (Number(statusCode)) {
          case 1:
            return 'statusActiveValidator';
          case 2:
            return 'statusCandidate';
          default:
            return '';
        }
      },

      getNodeStatusText(statusCode) {
        switch (Number(statusCode)) {
          case 1:
            return 'Validator';
          case 2:
            return 'Candidate';
          default:
            return 'Unknown status';
        }
      }
    };
  }
};
