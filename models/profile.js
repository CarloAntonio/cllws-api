const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    hometown: {
        hidden: { 
          type: Boolean, 
          required: true,
          default: true
        },
        title: {
          type: String,
          required: true,
          default: "Hometowm"
        },
        value: {
            type: String,
            required: false,
            default: ""
        }
    },
    livesIn: {
        hidden: { 
          type: Boolean, 
          required: true,
          default: true
        },
        title: {
          type: String,
          required: true,
          default: "Lives In"
        },
        value: {
            type: String,
            required: false,
            default: ""
        }
    },
    interest: {
      hidden: { 
        type: Boolean, 
        required: true,
        default: true
      },
      title: {
        type: String,
        required: true,
        default: "Interest"
      },
      value: {
          type: String,
          required: false,
          default: ""
      }
    },
    worksIn: {
        hidden: { 
          type: Boolean, 
          required: true,
          default: true
        },
        title: {
          type: String,
          required: true,
          default: "Works In"
        },
        value: {
            type: String,
            required: false,
            default: ""
        }
    },
    quote: {
        hidden: { 
          type: Boolean, 
          required: true,
          default: true
        },
        title: {
          type: String,
          required: true,
          default: "Quote"
        },
        value: {
            type: String,
            required: false,
            default: ""
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
});

// only use this function if you can't use
// projections during queries
profileSchema.methods.getPublicFields = function(){
  return {
    hometown: this.hometown,
    livesIn: this.livesIn,
    interest: this.interest,
    worksIn: this.worksIn,
    quote: this.quote,
  }
}

module.exports = mongoose.model('Profile', profileSchema);