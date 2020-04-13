import { Model } from 'radiks-gavin-test';

export default class UserGroupRecords extends Model {
  static className = 'UserGroupRecords';

  static schema = {
    id: String,
    KeyId: String,
    Key: String,
    name: String
  }

  static defaults = {
  }
}
