import { Model } from 'radiks';

export default class Transaction extends Model {
    static className = 'Message';

    static schema = {
        from: String,
        content: String,
        flag: {
            type: Boolean,
            decrypted: true
        },
        asset: {
            seller: String,
            buyer: String,
            price: Number,
            industry: String,
            datetime: Date,
            info: String
        }
    }

    static defaults = {
        content: "Welcome to message board"
    }
}