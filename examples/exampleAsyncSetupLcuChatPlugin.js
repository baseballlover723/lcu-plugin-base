import axios from 'axios';
import LcuPlugin from 'lcu-plugin';

const REGION_ENDPOINT = 'lol-platform-config/v1/namespaces/LoginDataPacket/competitiveRegion';
export default class ExampleAsyncSetupLcuChatPlugin extends LcuPlugin {
  constructor() {
    super();
  }

  onConnect(clientData) {
    axios.defaults.baseURL = `${clientData.protocol}://${clientData.address}:${clientData.port}`;
    axios.defaults.auth = { username: clientData.username, password: clientData.password };
    return this.createPromise((resolve, reject) => {
      this.getRegion().then((region) => {
        this.subscribeEvent('OnJsonApiEvent_lol-chat_v1_conversations', this.handleChat(region));
        this.log('is ready');
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getRegion(retriesLeft = 20) {
    return this.createPromise((resolve, reject) => {
      this.getRegionHelper(retriesLeft, resolve, reject);
    });
  }

  getRegionHelper(retriesLeft, resolve, reject) {
    axios.get(REGION_ENDPOINT).then((resp) => {
      resolve(resp.data);
    }).catch((error) => {
      if ((error.code !== 'ECONNREFUSED' && error?.response?.status >= 500) || retriesLeft <= 0) {
        this.error('error in getting region', error);
        reject(error);
      }
      setTimeout(() => {
        this.getRegionHelper(retriesLeft - 1, resolve, reject);
      }, 1000);
    });
  }

  handleChat(region) {
    return (event) => {
      this.log(`handle chat plugin with region ${region}, event: `, event);
    };
  }
}
