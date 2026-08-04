const { CronJob } = require('cron');
const { deleteExpiredAds } = require('../services/adService');

const job = new CronJob(
    '0 * * * * *',
    deleteExpiredAds,
    null,
    true,
    'Europe/Athens'
);
job.start();