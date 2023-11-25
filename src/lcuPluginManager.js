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

    this.connector.on('connect', async (clientData) => {
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
    });
  }

  start() {
    return this.connector.start();
  }

  stop() {
    return this.connector.stop();
  }

  connectPlugin(plugin) {
    if (this.plugins.indexOf(plugin) === -1) {
      this.plugins.push(plugin);
      for (const event in plugin.eventSubscriptions) {
        this.ws.subscribe(event, plugin.eventSubscriptions[event].bind(plugin));
      }
    } else {
      console.error('Trying to connect a plugin that is already connected');
    }
  }

  disconnectPlugin(plugin) {
    const index = this.plugins.indexOf(plugin);
    if (index > -1) {
      for (const event in plugin.eventSubscriptions) {
        this.ws.unsubscribe(event, plugin.eventSubscriptions[event].bind(plugin));
      }
      this.plugins = this.plugins.filter((connectedPlugin) => connectedPlugin !== plugin);
    } else {
      console.error('Trying to disconnect a plugin that is not connected');
    }
  }
}
