const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    hometown: {
        hidden: { 
          type: Boolean, 
          required: false,
        },
        title: {
          type: String,
          required: false
        },
        value: {
            type: String,
            required: false
        }
    },
    interest: {
        hidden: { 
          type: Boolean, 
          required: false,
        },
        title: {
          type: String,
          required: false
        },
        value: {
            type: String,
            required: false
        }
    },
    livesIn: {
        hidden: { 
          type: Boolean, 
          required: false,
        },
        title: {
          type: String,
          required: false
        },
        value: {
            type: String,
            required: false
        }
    },
    worksIn: {
        hidden: { 
          type: Boolean, 
          required: false,
        },
        title: {
          type: String,
          required: false
        },
        value: {
            type: String,
            required: false
        }
    },
    quote: {
        hidden: { 
          type: Boolean, 
          required: false,
        },
        title: {
          type: String,
          required: false
        },
        value: {
            type: String,
            required: false
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
});

module.exports = mongoose.model('Profile', profileSchema);