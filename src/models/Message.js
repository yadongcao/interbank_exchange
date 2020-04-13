import { Model } from 'radiks-gavin-test';

export default class Message extends Model {
  static className = 'Message';

  static schema = {
    from: String,
    content: String,
    groupname: String,
    userGroupId: {
      type: String,
      decrypted: true,
    }
  }

  static defaults = {
    userGroupId: ""
  }
}
