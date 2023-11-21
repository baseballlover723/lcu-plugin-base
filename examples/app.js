import LcuPluginManager from '../src/lcuPluginManager.js';
import ExampleBasicLCUChatPlugin from './exampleBasicLCUChatPlugin.js';
import ExampleAsyncSetupLCUChatPlugin from './exampleAsyncSetupLCUChatPlugin.js';

const pluginManager = new LcuPluginManager(new ExampleBasicLCUChatPlugin(), new ExampleAsyncSetupLCUChatPlugin());

pluginManager.start();
