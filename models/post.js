const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
});

// only use when query projection are not
// available, query projects will always
// be faster than returning all the data 
// running this function to get public fields
postSchema.methods.getPublicFields = function(){
  return {
    text: this.text,
    date: this.date,
    author: this.author.toString(),
  }
}

module.exports = mongoose.model('Post', postSchema);