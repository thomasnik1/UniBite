const { CronJob } = require('cron');
const { deleteExpiredAds } = require('./deleteExpiredAdsJob');
const { nonRatingPenalty } = require('./nonRatingPenalty')
 
const expiredAdsJob = new CronJob(
    '0 * * * *',
    deleteExpiredAds,
    null,
    true,
    'Europe/Athens'
);

const nonRatingPenaltyJob = new CronJob(
    '0 * * * *',
    nonRatingPenalty,
    null,
    true,
    'Europe/Athens'
);

expiredAdsJob.start();
nonRatingPenaltyJob.start();
