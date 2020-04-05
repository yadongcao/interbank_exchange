import { Model } from 'radiks';

export default class Message extends Model {
    static className = 'Message';

    static schema = {
        from: String,
        content: String,
        flag: {
            type: Boolean,
            decrypted: true
        }
    }

    static defaults = {
        content: "Welcome to message board"
    }
}