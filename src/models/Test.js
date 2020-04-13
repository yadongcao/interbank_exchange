import { Model } from 'radiks-gavin-test';

export default class Test extends Model {
  static className = 'Test';

  static schema = {
    content: String,
    flag : {
      type:Boolean,
      decrypted : true
    }
  }
}
