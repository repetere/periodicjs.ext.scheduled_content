'use strict';

var async = require('async'),
    CronJob = require('cron').CronJob,
    appSettings,
    mongoose,
    Collection,
    Item, //Item
    scheduled_itemid_array = [],
    scheduled_collectionid_array = [],
    logger;

var publishScheduledItemCollectionss = function () {
    scheduled_collectionid_array = [];
    scheduled_itemid_array = [];

    var updateScheduledContent = function (model, callback) {
        model
            .update({
                    status: 'schedule',
                    publishat: {
                        $lt: new Date()
                    }
                }, {
                    status: 'publish'
                }, {
                    multi: true
                },
                function (err, numberAffected, raw) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        if (numberAffected > 0) {
                            callback(null, 'number of updates items: ' + numberAffected + ' - ' + (new Date()),raw);
                        }
                        else {
                            callback(null, null);
                        }
                    }
                }
        );
    };

    try {
        var job = new CronJob({
            cronTime: '1 * * * * *',
            onTick: function () {
                async.parallel({
                        scheduledItems: function (callback) {
                            updateScheduledContent(Item, callback);
                        },
                        scheduledCollections: function (callback) {
                            updateScheduledContent(Collection, callback);
                        }
                    },
                    function (err, results) {
                        if (err) {
                            logger.error(err);
                        }
                        else {
                            if (results.scheduledItems || results.scheduledCollections) {
                                logger.silly(results.scheduledItems);
                            }
                        }
                    });
            },
            onComplete: function () {},
            start: true
            // timeZone: "America/Los_Angeles"
        });
        logger.silly(job);
        // job.start();
    }
    catch (e) {
        logger.error(e);
    }
};

module.exports = function (periodic) {
    // express,app,logger,config/settings,db
    logger = periodic.logger;
    mongoose = periodic.mongoose;
    appSettings = periodic.settings;
    Item = mongoose.model('Item');
    Collection = mongoose.model('Collection');
    publishScheduledItemCollectionss();
};