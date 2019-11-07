// Load .env configuration file
require('dotenv').config();
var debug = require('debug')('salesforce-swh:api');
var express = require('express');
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var http = require("http");
var SalesforceClient = require('salesforce-node-client');
const utils = require('./api/utils');
const middlwares = require('./api/middlewares');
const { asyncMiddleware } = middlwares;
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.REACT_APP_googleMapKey,
  Promise: Promise
});

// Redis Config
var redis = require("redis");
var pubDb = redis.createClient({
  url: process.env.HEROKU_REDIS_NAVY_URL
});

// Instantiate Salesforce client with .env configuration
const sfdc = new SalesforceClient();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(xmlparser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));

// Enable server-side sessions
app.use(
  session({
    secret: process.env.sessionSecretKey,
    cookie: { 
      // secure: process.env.isHttps === 'true'
      secure: false
    },
    resave: false,
    saveUninitialized: false
  })
);

// App
// app.use('/', express.static(path.join(__dirname, '../build')));
// app.use('/me', express.static(path.join(__dirname, '../build')));
// app.use('/login', express.static(path.join(__dirname, '../build')));
// app.use('/invoice', express.static(path.join(__dirname, '../build')));
// app.use('/not-found', express.static(path.join(__dirname, '../build')));

/**
 *  Attemps to retrieves the server session.
 *  If there is no session, redirects with HTTP 401 and an error message
 */
function getSession(request, response) {
  const session = request.session;
  if (typeof session['sfdcAuth'] === 'undefined') {
    response.status(401).send('No active session');
    return null;
  }
  return session;
}

// Salesforce Login endpoint
app.get('/api/auth/login', function(request, response, next) {
  // Redirect to Salesforce login/authorization page
  const uri = sfdc.auth.getAuthorizationUrl({ scope: 'api' });
  return response.redirect(uri);
});

// Salesforce OAuth Callback
app.get('/api/auth/callback', function(request, response, next) {
  if (!request.query.code) {
    response.status(500).send('Failed to get authorization code from server callback.');
    return;
  }
  debug('CALLBACK: ', request);

  // Authenticate with Force.com via OAuth
  sfdc.auth.authenticate({
    code: request.query.code
  }, (error, payload) => {
      if (error) {
        console.error('Force.com authentication error: ' + JSON.stringify(error));
        response.status(500).json(error);
        return;
      }
      debug('SESSION: ', payload);
      // Store oauth session data in server (never expose it directly to client)
      request.session.sfdcAuth = payload;
      return response.redirect('/');
    }
  );
});

// Logout
app.get('/api/auth/logout', function(request, response, next) {
  const session = getSession(request, response);
  if (session == null) return;

  // Revoke OAuth token
  sfdc.auth.revoke({ token: session.sfdcAuth.access_token }, function(error) {
    if (error) {
      console.error('Force.com OAuth revoke error: ' + JSON.stringify(error));
      response.status(500).json(error);
      return;
    }

    // Destroy server-side session
    session.destroy(function(error) {
      if (error) console.error('Force.com session destruction error: ' + JSON.stringify(error));
    });

    // Redirect to app main page
    return response.redirect('/');
  });
});

// Get user info
app.get('/api/whoami', asyncMiddleware( async (request, response, next) => {
  const session = getSession(request, response);
  if (session == null) return;
  console.log('SESSION: ', session);
  const res = await utils.getUserData(session);
  return response.status(res.status).json(res.json);
}));

app.post('/api/getSolarSystemProduction',  asyncMiddleware(async (request, response, next) => {
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;
  const res = await utils.getSolarSystemProduction(sfdc, session, body);
  return response.status(res.status).json(res.json);
}));

app.post('/api/getSolarSystemInvestmentAnalysis',  asyncMiddleware(async (request, response, next) => {
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;
  const res = await utils.getSolarSystemInvestmentAnalysis(sfdc, session, body);
  return response.status(res.status).json(res.json);
}));

app.post('/api/geocoding',  asyncMiddleware(async (request, response, next) => {
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;

  googleMapsClient
      .geocode({
        address: body.address
      })
      .asPromise()
      .then(res => {
        console.log("Geocoding Res: ", res.json.results[0].geometry.location);
        return response.json(res.json.results[0].geometry.location);
      })
      .catch(err => {
        console.log('googleMapsClient: ', err);
      });
}));

app.get('/api/Opportunity', asyncMiddleware(async (request, response, next) => {
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getOpportunities(sfdc, session);
  return response.status(res.status).json(res.json);
}));

app.get('/api/Opportunity/:id', asyncMiddleware(async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getOpportunities(sfdc, session, id);
  return response.status(res.status).json(res.json);
}));

app.get('/api/Opportunity/:id/OpportunityLineItems', asyncMiddleware(async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getOpportunityProducts(sfdc, session, id);
  return response.status(res.status).json(res.json);
}));

app.get('/api/Products', asyncMiddleware(async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getProducts(sfdc, session);
  return response.status(res.status).json(res.json);
}));

app.patch('/api/Opportunity/:id', asyncMiddleware(async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.updateOpportunity(sfdc, session, id, body);
  return response.status(res.status).json(res.json);
}))

app.post('/api/webhook/opportunity', asyncMiddleware(async (request, response, next) => {
  console.log('OPPORTUNITY UPDATE BODY: ', JSON.stringify(request.body, null, 2));
  const data = request.body['soapenv:envelope']['soapenv:body'][0]['notifications'][0]['notification'][0]['sobject'][0];
  console.log('Opportunity Data: ', data);
  const id = data['sf:id'][0];
  if (id) {
    pubDb.publish(`opportunity-${id}`, 'update');
  }
  const resXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
      <notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
        <Ack>true</Ack>
      </notificationsResponse>
    </soapenv:Body>
  </soapenv:Envelope>
  `;
  return response.send(resXML);
}));

// app.get('/api/opportunityMetadata', asyncMiddleware(async (request, response, next) => {
//   const { id } = request.params;
//   const body = request.body;
//   const session = getSession(request, response);
//   if (session == null) return;

//   const res = await utils.getOpportunities(sfdc, session, id);
//   return response.status(res.status).json(res.json);
// }));

app.get('/api/opportunityTemplates', asyncMiddleware(async (request, response, next) => {
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getOpportunityTemplates(sfdc, session);
  return response.status(res.status).json(res.json);
}));

app.get('/api/getOpportunityObjectInfo', asyncMiddleware(async (request, response, next) => {
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getOpportunityObjectInfo(sfdc, session);
  return response.status(res.status).json(res.json);
}));

app.get('/api/getOpportunityTemplateDefaultValues/:recordId', asyncMiddleware(async (request, response, next) => {
  const { recordId } = request.params;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getOpportunityTemplateDefaultValues(sfdc, session, recordId);
  return response.status(res.status).json(res.json);
}));


app.post('/api/createOpportunity', asyncMiddleware(async (request, response, next) => {
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;
  console.log(body);

  try {
    // create contact
    const accountRes = await utils.createAccount(sfdc, session, {
      FirstName: body.details.FirstName,
      LastName: body.details.LastName,
      Phone: body.details.Phone,
      PersonEmail: body.details.PersonEmail
      // BillingAddress: body.details.BillingAddress
    });
    if (accountRes.status === 500) throw new Error(accountRes.json);

    const AccountId = accountRes.json.id;
    console.log('AccountId: ', AccountId);

    // get opportunity data from template id
    const { templateId } = body;
    const opportunity = await utils.getOpportunities(sfdc, session, templateId);
    if (opportunity.status === 500) throw new Error(opportunity.json);

    // create opportunity
    const { attributes, Id, RecordTypeId, LastModifiedDate, Daily_Supply_Charge_incl_GST__c,
      EstimatedMonthlyRepayment__c, TotalSystemCostInclGST__c, HasOpenActivity, KlipLok_Roof_Panel_Installtion__c, IsDeleted, FiscalQuarter, UseFinance__c, Split_Array__c, DepositAmount__c, Solar_Panel_Product_Count__c, IsClosed, Landscape_Panel_Installation__c, SystemModstamp, LastActivityDate, GST__c, HasOpportunityLineItem, ForecastCategory, CreatedById, STCDiscount__c, Rack_Kit_Product__c, Cost_of_Power_incl_GST__c, BalanceDueOnCompletion__c, LastViewedDate, Fiscal, CreatedDate, HasOverdueTask, FiscalYear, LastReferencedDate, IsWon, LastModifiedById, MonthlyInterestRate__c, System_Margin__c, ...createOpportunityData } = opportunity.json;
    const opportunityRes = await utils.createOpportunity(sfdc, session, {
      ...createOpportunityData,
      Is_Template__c: false,
      Address_Line_1__c: body.installationAddress,
      AccountId
    });
    if (opportunityRes.status === 500) throw new Error(opportunityRes.json);
    return response.status(opportunityRes.status).json(opportunityRes.json);
  } catch (err) {
    console.log(err);
    return response.status(500).json(err);
  }
}));

app.get('/api/Account/:id', asyncMiddleware(async (request, response, next) => {
  const { id } = request.params;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.getAccount(sfdc, session, id);
  return response.status(res.status).json(res.json);
}))

app.patch('/api/Account/:id', asyncMiddleware(async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  const session = getSession(request, response);
  if (session == null) return;

  const res = await utils.updateAccount(sfdc, session, id, body);
  return response.status(res.status).json(res.json);
}))

app.use(express.static(path.join(__dirname, './build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

setInterval(() => {
  http.get("http://salesforce-swh.herokuapp.com");
}, 25 * 60 * 1000);

module.exports = app;
