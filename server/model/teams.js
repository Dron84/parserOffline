const mongoose = require('mongoose')
const squadShirt = new mongoose.Schema({
    shirtnumber: {type: Number},
    name: {type: String},
    flag: {type: String},
    squad: {type: String},
})

const squadRow = new mongoose.Schema({
    shirtnumber: {type: Number},
    name: {type: String},
    flag: {type: String},
    age: {type: Number},
    position: {type: String},
    'game-minutes': {type: Number},
    appearances: {type: Number},
    'lineups': {type: Number},
    'subs-on-bench': {type: Number},
    'goals': {type: Number},
    'assists': {type: Number},
    'yellow-cards': {type: Number},
    '2nd-yellow-cards': {type: Number},
    'red-cards': {type: Number},
    blue: {type: Boolean, default: false},
    lightblue: {type: Boolean, default: false},
    black: {type: Boolean, default: false},
    gamerStatus: {type: Number, default: null},
    LU: {type: String, default: null},
    UPS: {type: String, default: 'none'}
})

const teamData = new mongoose.Schema({
    date: {type: String},
    teamA: {type: String},
    teamB: {type: String},
    competition: {
        title: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    score: {type: String},
    linuplink: {type: String}
})
const matches = new mongoose.Schema({
    teamData,
    squad: [squadShirt],
})

const teamsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    img_href:{
        type: String,
    },
    offsite:{
        type: String,
    },
    matches: [matches],
    squad: [squadRow],
    addedDateTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
})

module.exports = mongoose.model('teams', teamsSchema)