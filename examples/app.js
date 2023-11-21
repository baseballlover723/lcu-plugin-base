import LcuPluginManager from '../src/lcuPluginManager.js';
import ExampleBasicLcuChatPlugin from './exampleBasicLcuChatPlugin.js';
import ExampleAsyncSetupLcuChatPlugin from './exampleAsyncSetupLcuChatPlugin.js';

const pluginManager = new LcuPluginManager(new ExampleBasicLcuChatPlugin(), new ExampleAsyncSetupLcuChatPlugin());

pluginManager.start();
