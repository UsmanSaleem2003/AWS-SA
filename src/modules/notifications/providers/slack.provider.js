export class SlackProvider {
  channel = 'slack';

  async validatePayload(_payload) {
    return true;
  }
}
