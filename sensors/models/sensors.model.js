const mongoose = require('mongoose');
const config = require('../../env.config');
mongoose.connect(config.server_url,{useCreateIndex: true,useNewUrlParser: true});
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
    email: {type:String,required:true,unique:true},
    temperature:{type:String},
    Gas:{type:String},
    Motion:{type:String}
    },
    {timestamps: true
});

sensorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
sensorSchema.set('toJSON', {
    virtuals: true
});

sensorSchema.findById = function (cb) {
    return this.model('Sensors').find({id: this.id}, cb);
};

const Sensor = mongoose.model('Sensors', sensorSchema);


exports.findByEmail = (email) => {
    return Sensor.find({email: email});
};

exports.findById = (id) => {
    return Sensor.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createSensor = (userData) => {
    const user = new Sensor(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Sensor.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, Sensors) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Sensors);
                }
            })
    });
};

exports.putSensor = (id,SensorData) => {
    return new Promise((resolve, reject) => {
        Sensor.findByIdAndUpdate(id,SensorData,function (err,user) {
            if (err) reject(err);
            resolve(user);
        });
    });
};

exports.patchSensor = (email, userData) => {
    return new Promise((resolve, reject) => {
        Sensor.findOneAndUpdate({email: email},{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
            
        });
    });
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        Sensor.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

