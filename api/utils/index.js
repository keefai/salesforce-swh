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

exports.getOpportunityTemplates = async (sfdc, session) => {
  var query = encodeURI('SELECT Id, Name, SystemSize__c FROM Opportunity WHERE Is_Template__c=true');
  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, 'query?q='+ query);
  try {
    const payload = await httpClient.get({ ...apiRequestOptions });
    console.log('getOpportunityTemplates', payload);
    return {
      status: 200,
      json: JSON.parse(payload)
    };
  } catch (error) {
    console.error('getOpportunityTemplates: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
  }
}

exports.getOpportunityObjectInfo = async (sfdc, session) => {
  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, 'ui-api/object-info/Opportunity');
  try {
    const payload = await httpClient.get({ ...apiRequestOptions });
    console.log('getOpportunityObjectInfo', payload);
    return {
      status: 200,
      json: JSON.parse(payload)
    };
  } catch (error) {
    console.error('getOpportunityObjectInfo: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
  }
}

exports.getOpportunityTemplateDefaultValues = async (sfdc, session, recordId) => {
  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, `ui-api/record-defaults/clone/${recordId}`);
  try {
    const payload = await httpClient.get({ ...apiRequestOptions });
    console.log('getOpportunityTemplateDefaultValues', payload);
    return {
      status: 200,
      json: JSON.parse(payload)
    };
  } catch (error) {
    console.error('getOpportunityTemplateDefaultValues: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
  }
}

// exports.createOpportunity = async (sfdc, session, data) => {
// 	console.log('createAccount Body: ', JSON.stringify(data, null, 2));
// 	try {
// 	  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, 'sobjects/Account');
//     const payload = await httpClient.post({ ...apiRequestOptions, body: data, json: true });
//     console.log(payload)
//     return {
//       status: 200,
//       json: payload
//     };
// 	} catch (error) {
// 		console.error('createAccount: Force.com data API error: '+ JSON.stringify(error));
//     return {
//       status: 500,
//       json: error
//     };
// 	}
// }

exports.getAccount = async (sfdc, session, id) => {
	try {
	  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, `sobjects/Account/${id}`);
    const payload = await httpClient.get({ ...apiRequestOptions });
    console.log('getAccount: ', payload);
    return {
      status: 200,
      json: JSON.parse(payload)
    };
	} catch (error) {
		console.error('getAccount: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
	}
}

exports.updateAccount = async (sfdc, session, id, data) => {
	console.log('updateAccount Body: ', JSON.stringify(data, null, 2));
	try {
	  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, `sobjects/Account/${id}`);
    const payload = await httpClient.patch({ ...apiRequestOptions, body: data, json: true });
    console.log('updateAccount: ', payload)
    return {
      status: 200,
      json: payload
    };
	} catch (error) {
		console.error('updateAccount: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
	}
}


exports.createAccount = async (sfdc, session, data) => {
	console.log('createAccount Body: ', JSON.stringify(data, null, 2));
	try {
	  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, 'sobjects/Account');
    const payload = await httpClient.post({ ...apiRequestOptions, body: data, json: true });
    console.log(payload)
    return {
      status: 200,
      json: payload
    };
	} catch (error) {
		console.error('createAccount: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
	}
}

exports.createOpportunity = async (sfdc, session, data) => {
  console.log('createOpportunity Body: ', JSON.stringify(data, null, 2));
	try {
	  const apiRequestOptions = sfdc.data.createDataRequest(session.sfdcAuth, 'sobjects/Opportunity');
    const payload = await httpClient.post({ ...apiRequestOptions, body: data, json: true });
    console.log(payload)
    return {
      status: 200,
      json: payload
    };
	} catch (error) {
		console.error('createOpportunity: Force.com data API error: '+ JSON.stringify(error));
    return {
      status: 500,
      json: error
    };
	}
}
