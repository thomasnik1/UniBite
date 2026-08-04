const { CronJob } = require('cron');
const { deleteExpiredAds } = require('../services/adService');

const job = new CronJob(
    '*/10 * * * * *',
    deleteExpiredAds,
    null,
    true,
    'Europe/Athens'
);
job.start();