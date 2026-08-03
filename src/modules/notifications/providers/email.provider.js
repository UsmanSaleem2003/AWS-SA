export class EmailProvider {
  channel = 'email';

  async validatePayload(_payload) {
    return true;
  }
}
