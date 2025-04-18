export default class AwsKeyService {
  constructor(private id: string, private title: string) {}

  private generateKey(prefix: string, randomStr?: string): string {
    let key = `${prefix}/${this.id}/${this.id}-${this.title.replace(
      /\s/g,
      "-"
    )}`;
    return randomStr ? `${key}-${randomStr}` : key;
  }

  offer(randomStr?: string) {
    return this.generateKey("offers", randomStr);
  }

  offerSection(randomStr?: string) {
    return this.generateKey("offerSections", randomStr);
  }

  service(randomStr?: string) {
    return this.generateKey("services", randomStr);
  }

  section(randomStr?: string) {
    return this.generateKey("sections", randomStr);
  }
}
