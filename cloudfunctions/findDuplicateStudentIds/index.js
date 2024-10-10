// cloudfunctions/findDuplicateStudentIds/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: 'cbh102201225-8gcwmhi730f02e6f', // 替换为您的云环境ID
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const aggregation = db.collection('users').aggregate()
      .group({
        _id: '$student_id',
        count: _.sum(1),
        openids: _.push('$openid')
      })
      .match({
        count: _.gt(1)
      });

    const res = await aggregation.end();
    return {
      success: true,
      duplicates: res.list
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString()
    };
  }
};
