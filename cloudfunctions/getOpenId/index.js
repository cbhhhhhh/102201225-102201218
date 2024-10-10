// cloudfunctions/getOpenId/index.js
const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  // console.log(wxContext)
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
};
