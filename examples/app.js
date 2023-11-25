import LcuPluginManager from '../src/lcuPluginManager.js';
import ExampleBasicLcuChatPlugin from './exampleBasicLcuChatPlugin.js';
import ExampleAsyncSetupLcuChatPlugin from './exampleAsyncSetupLcuChatPlugin.js';

const plugins = {
    exampleChat: new ExampleBasicLcuChatPlugin(),
    exampleAsync: new ExampleAsyncSetupLcuChatPlugin(),
};

const pluginManager = new LcuPluginManager(Object.values(plugins));

await pluginManager.start();

pluginManager.connectPlugin(plugins.exampleChat);
pluginManager.disconnectPlugin(plugins.exampleAsync);
console.log(pluginManager.plugins);
