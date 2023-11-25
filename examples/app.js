import LcuPluginManager from '../src/lcuPluginManager.js';
import ExampleBasicLcuChatPlugin from './exampleBasicLcuChatPlugin.js';
import ExampleAsyncSetupLcuChatPlugin from './exampleAsyncSetupLcuChatPlugin.js';

const plugins = {
  exampleChat: new ExampleBasicLcuChatPlugin(),
  exampleAsync: new ExampleAsyncSetupLcuChatPlugin(),
};

// const pluginManager = new LcuPluginManager(Object.values(plugins));
const pluginManager = new LcuPluginManager([plugins.exampleChat]);

pluginManager.connectPlugin(plugins.exampleAsync);

pluginManager.start();
