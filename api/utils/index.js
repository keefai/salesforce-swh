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

exports.getSolarSystemProduction = async (sfdc, session, data) => {
	console.log('getSolarSystemProduction Body: ', JSON.stringify(data, null, 2));
	var apiRequestOptions = sfdc.apex.createApexRequest(session.sfdcAuth, 'CalculateSolarSystemProduction');
	try {
    const payload = await httpClient.post({ ...apiRequestOptions, body: data, json: true });
    const json = JSON.parse(payload);
    console.log(json)
    return {
      status: 200,
      json
    };
	} catch (error) {
		console.error('getSolarSystemProduction: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
	}
}

exports.getSolarSystemInvestmentAnalysis = async (sfdc, session, data) => {
	console.log('getSolarSystemInvestmentAnalysis Body: ', JSON.stringify(data, null, 2));
	var apiRequestOptions = sfdc.apex.createApexRequest(session.sfdcAuth, 'CalculateSolarSystemInvestmentAnalysis');
	try {
    const payload = await httpClient.post({ ...apiRequestOptions, body: data, json: true });
    const json = JSON.parse(payload);
    console.log(json)
    return {
      status: 200,
      json
    };
	} catch (error) {
		console.error('getSolarSystemInvestmentAnalysis: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
	}
}

exports.getOpportunities = async (sfdc, session, id) => {
  let apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, 'sobjects/Opportunity');
  if (id) {
    apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, `sobjects/Opportunity/${id}`);
  }
  try {
    const payload = await httpClient.get({ ...apiRequestOptions, json: true });
    console.log('getOpportunities', payload);
    return {
      status: 200,
      json: payload
    };
  } catch (error) {
    console.error('getOpportunities: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
  }
}

exports.updateOpportunity = async (sfdc, session, id, data) => {
  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, `sobjects/Opportunity/${id}`);
  try {
    const payload = await httpClient.patch({ ...apiRequestOptions, body: data, json: true });
    console.log('updateOpportunity', payload);
    return {
      status: 200,
      json: payload
    };
  } catch (error) {
    console.error('updateOpportunity: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
  }
}