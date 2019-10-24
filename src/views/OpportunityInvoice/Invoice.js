import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { PDFExport } from '@progress/kendo-react-pdf';
import CircularProgress from '@material-ui/core/CircularProgress';
import style from './style.module.scss';
import './print.scss';
import api from '../../common/api';
import Sidebar from './components/Sidebar';
import Chart1 from './components/Charts/Chart1';
import Chart2 from './components/Charts/Chart2';
import Signature from './components/Signature';
import EditableInput from './components/EditableInput';
import Map from './components/Map';

const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const Invoice = ({ data }) => {
  let resume = React.createRef();
  const [sign, setSign] = useState('');
  const [signModal, setSignModal] = useState(false);
  
  // user details
  let addressTimer = null;
  const [address, setAddress] = useState('Apple Headquarters, Infinite Loop');
  const [city, setCity] = useState('Cupertino, USA');
  const [fullAddress, setFullAddress] = useState(`${address}, ${city}`)

  const setAddressForMap = () => {
    addressTimer = setTimeout(() => {
      setFullAddress(`${address}, ${city}`);
    }, 2000);
  }

  const handleAddress = (e) => {
    clearTimeout(addressTimer);
    setAddress(e.target.value);
  }

  const handleCity = (e) => {
    clearTimeout(addressTimer);
    setCity(e.target.value);
  }

  // chart1
  const [chart1Data, setChart1Data] = useState({
    InitialCost: 5070,
    EnergyUsageProfile: {
      DayUsagePercentage: data.DayUsagePercentage__c,
      NightUsagePercentage: data.NightUsagePercentage__c,
      AverageDailyUsage: data.AverageDailyUsage__c,
      PredictedAnnualRiseInPowerCost: data.PredictedAnnualRiseInPowerCost__c,
      PredictedAnnualRiseInFeedintarriff: data.PredictedAnnualRiseInFeedInTarrif__c
    },
    EnergyRetailerProfile: {
      CostOfPower: data.Cost_of_Power_ex_GST__c,
      DailySupplyCharge: data.Daily_Supply_Charge_ex_GST__c,
      FeedinTarrif: data.Feed_in_tariff__c
    },
    SolarSystemProduction: {
      AverageDailyProduction: 13,
      AverageAnnualProduction: 4883.7
    }
  });

  const handleChart1Input = (field1, field2) => (e) => {
    if (field2) {
      setChart1Data({
        ...chart1Data,
        [field1]: {
          ...chart1Data[field1],
          [field2]: e.target.value
        }
      });
    } else {
      setChart1Data({
        ...chart1Data,
        [field1]: e.target.value
      });
    }
  }

  // chart2
  const [chart2Data, setChart2Data] = useState({
    SystemSize: data.SystemSize__c,
    SystemEfficiency: data.SystemEfficiency__c
  });

  const handleChart2Input = (field) => (e) => {
    setChart2Data({
      ...chart2Data,
      [field]: e.target.value
    });
  }

  // save pdf function
  const exportPDF = () => {
    resume.save();
  };

  // modal handlers
  const openModal = () => setSignModal(true);
  const closeModal = () => setSignModal(false);

  return (
    <React.Fragment>
      <div className={style.page}>
        <h4>Test</h4>
        <table className={style.table}>
          <tbody>
            <tr>
              <td>System Efficiency</td>
              <td className={style.editTd}>
                <EditableInput
                  type='integer'
                  min='0'
                  value={chart2Data.SystemEfficiency}
                  onChange={handleChart2Input('SystemEfficiency')}
                />
              </td>
            </tr>
            <tr>
              <td>Predicted Annual Rise In FeedinTarrif</td>
              <td className={style.editTd}>
                <EditableInput
                  type='float'
                  min={0}
                  value={chart1Data.EnergyUsageProfile.PredictedAnnualRiseInFeedintarriff}
                  onChange={handleChart1Input('EnergyUsageProfile', 'PredictedAnnualRiseInFeedintarriff')}
                  suffix='% p.a.'
                />
              </td>
            </tr>
            <tr>
              <td>Inital Cost</td>
              <td className={style.editTd}>
                <EditableInput
                  type='integer'
                  min={0}
                  value={chart1Data.InitialCost}
                  onChange={handleChart1Input('InitialCost')}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <hr />
      <Sidebar exportPDF={exportPDF} openModal={openModal} />
      <Signature state={signModal} closeModal={closeModal} setSign={setSign} />
      <PDFExport
        scale={0.55}
        paperSize="A4"
        forcePageBreak=".page-break"
        margin={{ top: 20 }}
        fileName="invoice.pdf"
        ref={r => (resume = r)}
      >
        <div className={style.page}>
          <Grid container spacing={3}>
            <Grid item xs={4} className={style.logotitle}>
              YOUR SOLAR QUOTE
            </Grid>
            <Grid item xs={4} className={style.logoContainer}>
              <img src="/images/logos/swa.png" alt="swa-logo" className={style.logo} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div>Your Name</div>
              <div>
                <EditableInput
                  type='text'
                  value={address}
                  placeholder="Address"
                  inputStyle={{
                    minWidth: '150px',
                    textAlign: 'left'
                  }}
                  onChange={handleAddress}
                />
              </div>
              <div>
                <EditableInput
                  type='text'
                  value={city}
                  placeholder="City"
                  inputStyle={{
                    minWidth: '150px',
                    textAlign: 'left'
                  }}
                  onChange={handleCity}
                />
              </div>
              <div>youremail@gmail.com</div>
              <br />
              <div>07/09/2019</div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div className={style.heading}>YOUR HOME ENERGY SOLUTION</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>System Size</td>
                    <td className={style.editTd}>
                      <EditableInput
                        type='integer'
                        min='0'
                        value={chart2Data ? chart2Data.SystemSize : ''}
                        onChange={handleChart2Input('SystemSize')}
                        suffix=' kW'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Number of Panels</td>
                    <td>24</td>
                  </tr>
                  <tr>
                    <td>Solar Panel Product</td>
                    <td>LG NeON2 345W Optimized</td>
                  </tr>
                  <tr>
                    <td>Inverter Product</td>
                    <td>SolarEdge 8kW (SE8000H)</td>
                  </tr>
                </tbody>
              </table>
              <div className={style.heading} style={{ marginTop: '20px' }}>
                YOUR BATTERY COSTS AND ESTIMATED SAVINGS
              </div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Cost of Power</td>
                    <td className={style.editTd}>
                      <EditableInput
                        type='float'
                        min={0}
                        value={chart1Data.EnergyRetailerProfile.CostOfPower}
                        onChange={handleChart1Input('EnergyRetailerProfile', 'CostOfPower')}
                        prefix='$'
                        suffix='/kWh'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Daily supply charge</td>
                    <td className={style.editTd}>
                      <EditableInput
                        type='float'
                        min={0}
                        value={chart1Data.EnergyRetailerProfile.DailySupplyCharge}
                        onChange={handleChart1Input('EnergyRetailerProfile', 'DailySupplyCharge')}
                        prefix='$'
                        suffix='/Day'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Feed-in Tariff</td>
                    <td className={style.editTd}>
                      <EditableInput
                        type='float'
                        min={0}
                        value={chart1Data.EnergyRetailerProfile.FeedinTarrif}
                        onChange={handleChart1Input('EnergyRetailerProfile', 'FeedinTarrif')}
                        prefix='$'
                        suffix='/kWh'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Predicted Energy Price Rise</td>
                    <td className={style.editTd}>
                      <EditableInput
                        type='float'
                        min={0}
                        value={chart1Data.EnergyUsageProfile.PredictedAnnualRiseInPowerCost}
                        onChange={handleChart1Input('EnergyUsageProfile', 'PredictedAnnualRiseInPowerCost')}
                        suffix='% p.a.'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Average Daily Energy Usage</td>
                    <td>-- kWH</td>
                  </tr>
                  <tr>
                    <td>Approx. Quarterly Energy Use</td>
                    <td>-- kWH</td>
                  </tr>
                  <tr>
                    <td>Day Usage</td>
                    <td className={style.editTd}>
                      <EditableInput
                        type='integer'
                        min='0'
                        value={chart1Data.EnergyUsageProfile.DayUsagePercentage}
                        onChange={handleChart1Input('EnergyUsageProfile', 'DayUsagePercentage')}
                        suffix='%'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Night Usage</td>
                    <td className={style.editTd}>
                      <EditableInput
                        type='integer'
                        min='0'
                        value={chart1Data.EnergyUsageProfile.NightUsagePercentage}
                        onChange={handleChart1Input('EnergyUsageProfile', 'NightUsagePercentage')}
                        suffix='%'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Average 1st year quarterly savings*</td>
                    <td>$--</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Estimated first year savings*</b>
                    </td>
                    <td>
                      <b>$--</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Return On Investment**</b>
                    </td>
                    <td>
                      <b>-- Years</b>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={style.heading} style={{ marginTop: '20px' }}>
                YOUR ENERGY PRODUCTION ESTIMATES
              </div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Average Daily Energy Production</td>
                    <td>
                      {chart1Data.SolarSystemProduction.AverageDailyProduction} kWh
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Approx. 1<sup>st</sup> Year Energy Production
                    </td>
                    <td>
                      {chart1Data.SolarSystemProduction.AverageAnnualProduction} kWh
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={style.heading} style={{ marginTop: '20px' }}>
                YOUR WARRANTIES
              </div>
              <table className={style.table2}>
                <tbody>
                  <tr>
                    <td>
                      <b>Panels</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      LG offer an industry leading 25 year product warranty and a 25 year power output warranty. <br />{' '}
                      For more information on their products and warranties please click <a href="#">here</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Inverters</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      LG offer an industry leading 25 year product warranty and a 25 year power output warranty. <br />
                      <a href="#">Syntax Error</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Installation</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Solar Warehouse Australia proudly offers a 60 month installation warranty. For more infomation
                      visit our website{' '}
                      <a href="www.solarwarehouseaustralia.com.au" target="_blank">
                        www.solarwarehouseaustralia.com.au
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Grid>
            <Grid item xs={6}>
              <div className={style.chartContainer}>
                <Chart1 data={{
                  Savings: JSON.parse(data.SavingsList__c)
                }} />
              </div>
              <div className={style.chartContainer}>
                <Chart2 data={JSON.parse(data.Annual_Production__c)} />
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3} className={style.disclaimer}>
            <small>
              *All savings calculations and ROI are only estimations and vary based on actual usage. The ROI does not
              include any finance related costs.
            </small>
          </Grid>

          <Grid container spacing={3} className={`page-break ${style.pageBreak}`}>
            <Grid item xs={6}>
              <div className={style.heading}>YOUR INSTALL DETAILS</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Installation Address</td>
                    <td>5 Celtic Avenue CLOVELLY PARK</td>
                  </tr>
                  <tr>
                    <td>Multi Storey</td>
                    <td>{data.Multi_storey__c ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>Split Count</td>
                    <td>{data.Split_Count__c}</td>
                  </tr>
                  <tr>
                    <td>Steep Roof (>30)</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Meter Isolator</td>
                    <td>{data.Meter_Isolator__c ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>Cherry Picker Required</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Roof Mount Type</td>
                    <td>{data.Roof_Type__c}</td>
                  </tr>
                  <tr>
                    <td>Electricity Provider</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Meter Number</td>
                    <td>{data.Meter_Number__c}</td>
                  </tr>
                  <tr>
                    <td>Number of Phases</td>
                    <td>{data.Number_of_Phases__c}</td>
                  </tr>
                  <tr>
                    <td>National Meter Identifier (NMI)</td>
                    <td>{data.NMI__c}</td>
                  </tr>
                </tbody>
              </table>
              <div className={`${style.heading} ${style.yourPaymentDetails}`}>YOUR PAYMENT DETAILS</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Cost of System (excluding GST)*</td>
                    <td>${data.TotalSystemCostExclGST__c}</td>
                  </tr>
                  <tr>
                    <td>GST</td>
                    <td>${data.GST__c}</td>
                  </tr>
                  <tr>
                    <td>Promo Discount</td>
                    <td>$1,665.90</td>
                  </tr>
                  <tr>
                    <td>STC Discount</td>
                    <td>${data.STCDiscount__c}</td>
                  </tr>
                  <tr style={{ height: '75px' }}>
                    <td>
                      <b>SALE PRICE</b> (After Discounts/Rebates)
                    </td>
                    <td>
                      <b>$11,499.51</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Deposit Amount</b>
                    </td>
                    <td>${data.DepositAmount__c}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Balance Due On Day Of Install Via Rate Setter Finance</b>
                    </td>
                    <td>${data.BalanceDueOnCompletion__c}</td>
                  </tr>
                </tbody>
              </table>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div className={style.chartContainer} style={{ marginRight: '10px' }}>
                  <div className={style.chart} style={{ padding: '5% 15%' }}>
                    <img src="/images/dummy1.png" alt="dummy-1" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className={style.chartContainer} style={{ marginLight: '10px' }}>
                  <div className={style.chart} style={{ padding: '5% 15%' }}>
                    <img src="/images/dummy2.png" alt="dummy-2" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
              <div className={style.chartContainer}>
                <div className={style.chart} style={{ padding: '2% 4%' }}>
                  <div className={style.heading2}>Proposed Solar Panel Layout</div>
                  <Map address={fullAddress} containerStyle={{
                    position: 'relative',
                    width: '100%',
                    height: '400px'
                  }} />
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={style.paymentTerms}>
            <Grid item xs={12}>
              <b>Payment Terms</b>
              <p>
                If you wish to proceed with this quote, please complete and sign this form and forward it to Solar
                Warehouse Australia, 678 North East Road, Holden Hill, SA 5088 or via email to
                info@solarwarehouseaustralia.com.au
              </p>
              <br />
              <p>
                Upon Acceptance of this agreement, we require a deposit to be paid at time of submitting the agreed
                quote. With the remainder of the balance due on the day of installation of your solar PV system.
              </p>
              <table className={`${style.table3} ${style.paymentTable}`}>
                <thead>
                  <tr>
                    <th>Full Payment Upfront</th>
                    <th>Credit Card Payment</th>
                    <th>Direct Transfer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Free Anniversary Clean & System Health Check Valued at $299</td>
                    <td>Visa and MasterCard accepted Payments incur a 2% surcharge.</td>
                    <td>
                      Solar Warehouse Australia
                      <br />
                      BSD: 065 150 AC: 1070 4370
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className={style.agreement}>
                In signing this quotation, I authorise Solar Warehouse Australia to install a solar PV system in
                accordance with the terms available at solarwarehouseaustralia.com.ai hereby forming a contrat of sale.
                I have read and agree with all of Solar Warehouse Australia's terms and conditions as listed on their
                website. I am aware of my right to a 10-day cooling off period and understand the cooling off period
                beings from the date this contract is signed.
              </p>
              <table className={style.table3}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Signed</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ height: '70px' }}>
                    <td>Alex Kuchel</td>
                    <td>
                      {sign && (
                        <img
                          src={sign}
                          alt="sign"
                          style={{
                            height: '50px'
                          }}
                        />
                      )}
                    </td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </Grid>
          </Grid>
        </div>
        <br />
      </PDFExport>
    </React.Fragment>
  );
};

export default Invoice;
