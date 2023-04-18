//MongoDB is a database solution/ engine, a tool you can use to run very efficient NoSQL databases.
//In NoSQL, we have collections instead of tables and inside each collections we have documents instead of records. MongoDB uses json to store data in collections
//MongoDB is schemaless, means each record can have different structure. Here we have fewer data relations. We have option to relate document by embedding/ nestiong them or through references. This is done as here we have a lot of duplicacy
const mongoDB = require('mongodb')
const mongoClient = mongoDB.MongoClient
let _db;

//To connect to database, we can wrap connection code to a method
const mongoConnect = (cbk) => {
//Here we connect to shop here to get access to 'shop' database to which we automatically connect and you could also enter the database name here to overwrite 'test' (by default). If doesn't exist, mongoDB will create that database
mongoClient.connect('mongodb+srv://mathurvidhi2505:%24VidhiM%4025@cluster0.mjodwc6.mongodb.net/shop?retryWrites=true&w=majority')
.then(client => {
    console.log('Success')
    //In _db, store access to the database 'test' (by default)
    _db = client.db()
    cbk(client)
})
.catch(err => {
    console.log(err)
    throw err
})
}

const getDb = () => {
    //If _db isn't undefined
    if(_db){
        return _db
    }
    throw 'No database found'
}

//Here we export two methods, one for connecting and storing the connection to the database which will keep on running and other to return access to that connected database if it exists. This is managed by mongoDB with connection pooling where it will make sure to provide sufficient connections for multiple simultaneous interactions with the database
exports.mongoConnect = mongoConnect
exports.getDb = getDb
