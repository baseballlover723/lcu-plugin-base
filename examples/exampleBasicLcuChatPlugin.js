import LcuPlugin from 'lcu-plugin';

export default class ExampleBasicLcuChatPlugin extends LcuPlugin {
  constructor() {
    super();
  }

  onConnect(clientData) {
    this.subscribeEvent('OnJsonApiEvent_lol-chat_v1_conversations', this.handleChat);
    this.log('is ready');
  }

  handleChat(event) {
    this.log('examples basic chat plugin event: ', event);
  }
}
