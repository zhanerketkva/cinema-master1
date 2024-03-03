const {Schema, model} = require('mongoose')


const Role = new Schema({
    id: {type: Number, required: true},
    value: {type: String, unique: true, default: "USER"},
})

module.exports = model('Role', Role)
