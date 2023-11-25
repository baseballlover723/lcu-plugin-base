import LCUConnector from 'lcu-connector';
import RiotWebSocket from './riotWebSocket.js';

export default class LcuPluginManager {
  constructor(plugins) {
    if (!Array.isArray(plugins)) {
      throw new Error('Must instantiate with an array of plugins.');
    }

    this.connector = new LCUConnector();
    this.plugins = plugins;
    this.ws = null;
    this.clientData = null;

    this.connector.on('connect', async (clientData) => {
      this.clientData = clientData;
      const onConnectPromises = [];
      for (const plugin of this.plugins) {
        const promise = plugin.onConnect(clientData);
        onConnectPromises.push(promise);
      }
      console.log(`Waiting for ${this.plugins.length} plugins to setup`);
      await Promise.all(onConnectPromises);
      this.ws = new RiotWebSocket(clientData);

      this.ws.on('open', () => {
        for (const plugin of this.plugins) {
          for (const event in plugin.eventSubscriptions) {
            this.ws.subscribe(event, plugin.eventSubscriptions[event]);
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
      this.clientData = null;
    });
  }

  start() {
    this.connector.start();
  }

  // TODO If you start, stop, then start, it doesn't work
  stop() {
    this.connector.stop();
  }

  async connectPlugin(plugin) {
    if (this.plugins.indexOf(plugin) !== -1) {
      console.error('Trying to connect a plugin that is already connected');
      return;
    }
    this.plugins.push(plugin);
    if (this.clientData === null) {
      return; // Client isn't started, no setup required
    }
    const promise = plugin.onConnect(this.clientData);
    await promise;

    for (const event in plugin.eventSubscriptions) {
      this.ws.subscribe(event, plugin.eventSubscriptions[event]);
    }
  }

  async disconnectPlugin(plugin) {
    const index = this.plugins.indexOf(plugin);
    if (index === -1) {
      console.error('Trying to disconnect a plugin that is not connected');
      return;
    }

    for (const event in plugin.eventSubscriptions) {
      this.ws.unsubscribe(event, plugin.eventSubscriptions[event]);
    }
    delete this.plugins[index];
    const promise = plugin.onClose();
    await promise;
  }
}
