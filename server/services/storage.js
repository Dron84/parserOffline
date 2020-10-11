const starageModel = require('../model/starageModel')
'use strict';

class DBStorage {
    constructor({user_id,key,data,newData}){
        this.user_id = user_id
        this.key = key
        this.data = data
        this.newData = newData
    }
    async get(){
        return await starageModel.find({user_id: this.user_id}).exec()
    } 

    async getDataByKey(){
        return await starageModel.find({user_id: this.user_id, key: this.key}).exec()
    }
    async saveData(){
        return await new starageModel({user_id: this.user_id,key: this.key, data: this.data, update_at: new Date }).save()
    }
    async updateData(){
        return await starageModel.findOneAndUpdate( {user_id: this.user_id, key: this.key} , {user_id: this.user_id, key: this.key, data: this.data, update_at: new Date}, {returnNewDocument: true} ).exec()
    }
    async save(){
        const find = await this.getDataByKey()
        return this.newData && find.length>0 ? await this.updateData() :await this.saveData()
    }
}

module.exports = {DBStorage}