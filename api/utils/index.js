const httpClient = require('request-promise');
const fs = require('fs');

exports.getUserData = async (session) => {
  try {
    const payload = await httpClient.get({
      url: session.sfdcAuth.id,
      headers: {
        Authorization: `Bearer ${session.sfdcAuth.access_token}`
      },
      json: true
    });
    return {
      status: 200,
      json: payload
    };
  } catch (error) {
    console.error('getUserData: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
  }
}

exports.getSolarSystemProduction = async (session, body) => {
  try {
    const payload = await httpClient.post({
      url: session.sfdcAuth.id,
      headers: {
        Authorization: `Bearer ${session.sfdcAuth.access_token}`
      },
      body,
      json: true
    });
    return {
      status: 200,
      json: payload
    };
  } catch (error) {
    console.error('getUserData: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
  }
}
