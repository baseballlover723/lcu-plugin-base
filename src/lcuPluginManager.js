import LCUConnector from 'lcu-connector';
import RiotWebSocket from './riotWebSocket.js';

export default class LcuPluginManager {
  constructor(...plugins) {
    this.connector = new LCUConnector();
    this.plugins = plugins;

    this.connector.on('connect', async (clientData) => {
      const onConnectPromises = [];
      for (const plugin of this.plugins) {
        const promise = plugin.onConnect(clientData);
        onConnectPromises.push(promise);
      }
      console.log(`Waiting for ${this.plugins.length} plugins to setup`);
      await Promise.all(onConnectPromises);
      const ws = new RiotWebSocket(clientData);

      ws.on('open', () => {
        for (const plugin of this.plugins) {
          for (const event in plugin.eventSubscriptions) {
            ws.subscribe(event, plugin.eventSubscriptions[event]);
          }
        }
        console.log('ready and listening for events');
      });
    });

    this.connector.on('disconnect', () => {
      console.log('League Client has been closed');
      for (const plugin of plugins) {
        plugin.onClose();
      }
    });
  }

  start() {
    this.connector.start();
  }

  stop() {
    this.connector.stop();
  }
}
