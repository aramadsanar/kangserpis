const sequelize = require('../util/db/db')
module.exports = async (callback) => {
    require('../util/db/enforceRelations')()
    try {
        await sequelize.sync({force: true})
        callback()
    }
    
    catch(err) {console.log("sync err: ", err)}
}

