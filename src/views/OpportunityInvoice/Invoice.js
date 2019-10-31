import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { withSnackbar } from 'notistack';
import { PDFExport } from '@progress/kendo-react-pdf';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import style from './style.module.scss';
import './print.scss';
import api from '../../common/api';
import { difference } from '../../common/helpers';
import Sidebar from './components/Sidebar';
import Chart1 from './components/Charts/Chart1';
import Chart2 from './components/Charts/Chart2';
import Signature from './components/Signature';
import EditableInput from './components/EditableInput';
import Map from './components/Map';
import CreateNew from './components/CreateNew';
import YesNoDropdown from './components/YesNoDropdown';

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const AddButton = (props) => (
  <IconButton aria-label="add" {...props}>
    <AddIcon fontSize="medium" />
  </IconButton>
)

const RemoveButton = (props) => (
  <IconButton aria-label="add" {...props}>
    <RemoveIcon fontSize="medium" />
  </IconButton>
)

const Invoice = ({ data, ...props }) => {
  let resume = React.createRef();
  const [sign, setSign] = useState('');
  const [signModal, setSignModal] = useState(false);
  const [oppData, setOppData] = useState(data);

  useEffect(() => {
    setOppData(data);
  }, [data]);

  // Save Data
  const saveData = (ndata, odata) => {
    const diff = difference(ndata, odata);
    console.log('PATCH: ', diff);
    api
      .patch(`/Opportunity/${ndata.Id}`, diff)
      .then(res => {
        console.log(res);
        props.enqueueSnackbar('Data Saved', {
          autoHideDuration: 1000
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  const debouncedSaveData = useCallback(_.debounce(saveData, 2000), []);

  const handleOppData = field => e => {
    const newData = {
      ...oppData,
      [field]: e.target.value
    };
    setOppData(newData);
    debouncedSaveData(newData, data);
  };

  const oppDataBlur = () => {
    // debouncedSaveData.flush();
    console.log('On Blur');
  };

  const [missData, setMissData] = useState({
    numberOfPanels: '--',
    solarPanelProduct: '--',
    solarPanelProductQ: 0,
    inverterProduct: '--',
    inverterProductQ: 0,
    batteryProduct: '--',
    batteryProductQ: 0,
    approxQuarterlyEnergyUse: '--'
  });

  const handleMissData = field => e => {
    setMissData({
      ...missData,
      [field]: e.target.value
    });
  };

  // solar panel product
  const [spProduct, setSpProduct] = useState([
    {
      product: '',
      quantity: ''
    }
  ]);

  const handleSpProductData = (i, field) => e => {
    const oldSp = spProduct;
    oldSp[i][field] = e.target.value;
    setSpProduct(oldSp);
  }

  const addSpProduct = e => {
    setSpProduct([
      ...spProduct,
      {
        product: '',
        quantity: ''
      }
    ]);
  }

  const removeSpProduct = i => e => {
    const newSp = spProduct.filter((p, pi) => pi !== i);
    setSpProduct(newSp);
  }

  // inverter product
  const [invProduct, setInvProduct] = useState([
    {
      product: '',
      quantity: ''
    }
  ]);

  const handleInvProductData = (i, field) => e => {
    const oldInv = invProduct;
    oldInv[i][field] = e.target.value;
    setInvProduct(oldInv);
  }

  const addInvProduct = e => {
    setInvProduct([
      ...invProduct,
      {
        product: '',
        quantity: ''
      }
    ]);
  }

  const removeInvProduct = i => e => {
    const newInv = invProduct.filter((p, pi) => pi !== i);
    setInvProduct(newInv);
  }

  // battery product
  const [batProduct, setBatProduct] = useState([
    {
      product: '',
      quantity: ''
    }
  ]);

  const handleBatProductData = (i, field) => e => {
    const oldBat = batProduct;
    oldBat[i][field] = e.target.value;
    setBatProduct(oldBat);
  }

  const addBatProduct = e => {
    setBatProduct([
      ...batProduct,
      {
        product: '',
        quantity: ''
      }
    ]);
  }

  const removeBatProduct = i => e => {
    const newBat = batProduct.filter((p, pi) => pi !== i);
    setBatProduct(newBat);
  }

  // create new
  const [create, setCreate] = useState(false);
  const onBoarding = state => () => {
    setCreate(state);
  };

  // user details
  const [address, setAddress] = useState('Apple Headquarters, Infinite Loop');
  const [city, setCity] = useState('Cupertino, USA');
  const [fullAddress, setFullAddress] = useState(`${address}, ${city}`);

  const setAddressForMap = (add, cit) => {
    setFullAddress(`${add}, ${cit}`);
  };

  const handleAddress = e => {
    setAddress(e.target.value);
    setAddressForMap(e.target.value, city);
  };

  const handleCity = e => {
    setCity(e.target.value);
    setAddressForMap(address, e.target.value);
  };

  // helpers
  const getFirstYearQuarterlySavings = () => {
    return oppData.SavingsList__c ? (JSON.parse(oppData.SavingsList__c)[0].Total / 4).toFixed(2) : 0.0;
  };

  const getEstimatedFirstYearSavings = () => {
    return oppData.SavingsList__c ? JSON.parse(oppData.SavingsList__c)[0].Total.toFixed(2) : 0.0;
  };

  // save pdf function
  const exportPDF = () => {
    resume.save();
  };

  // modal handlers
  const openModal = () => setSignModal(true);
  const closeModal = () => setSignModal(false);

  return (
    <React.Fragment>
      <CreateNew state={create} close={onBoarding(false)} />
      <div className={style.page}>
        <h4>Test</h4>
        <table className={style.table}>
          <tbody>
            <tr>
              <td>System Efficiency</td>
              <td className={style.editTd}>
                <EditableInput
                  type="integer"
                  value={oppData.SystemEfficiency__c}
                  onChange={handleOppData('SystemEfficiency__c')}
                  onBlur={oppDataBlur}
                />
              </td>
            </tr>
            <tr>
              <td>Predicted Annual Rise In FeedinTarrif</td>
              <td className={style.editTd}>
                <EditableInput
                  type="float"
                  value={oppData.PredictedAnnualRiseInFeedInTarrif__c}
                  onChange={handleOppData('PredictedAnnualRiseInFeedInTarrif__c')}
                  suffix="% p.a."
                  onBlur={oppDataBlur}
                />
              </td>
            </tr>
            <tr>
              <td>Inital Cost</td>
              <td className={style.editTd}>
                // --
                {/* <EditableInput
                  type='integer'
                  value={chart1Data.InitialCost}
                  onChange={handleChart1Input('InitialCost')}
                /> */}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <Button color="primary" onClick={onBoarding(true)}>
          Onboarding
        </Button>
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
                  type="text"
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
                  type="text"
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
                    <td className={style.green}>
                      {oppData.SystemSize__c}
                      {/* <EditableInput
                        type='integer'
                        value={oppData.SystemSize__c}
                        onChange={handleOppData('SystemSize__c')}
                        suffix=' kW'
                        onBlur={oppDataBlur}
                      /> */}
                    </td>
                    <td className={style.hidden}>&nbsp;</td>
                    <td className={style.hidden}>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Number of Panels</td>
                    <td className={style.violet}>
                      <EditableInput
                        type="integer"
                        value={missData.numberOfPanels}
                        onChange={handleMissData('numberOfPanels')}
                      />
                    </td>
                    <td className={style.hidden}>&nbsp;</td>
                    <td className={style.hidden}>&nbsp;</td>
                  </tr>
                  {
                    spProduct.map((p, i) => (
                      <tr>
                        <td>Solar Panel Product</td>
                        <td className={style.violet}>
                          <EditableInput
                            type="text"
                            value={p.product}
                            onChange={handleSpProductData(i, 'product')}
                          />
                        </td>
                        <td className={style.numberTd}>
                          <EditableInput
                            type="integer"
                            value={p.quantity}
                            onChange={handleSpProductData(i, 'quantity')}
                          />
                        </td>
                        <td className={style.addRemoveTd}>
                          { i === (spProduct.length - 1) ?
                            <AddButton onClick={addSpProduct} />
                            :
                            <RemoveButton onClick={removeSpProduct(i)} />
                          }
                        </td>
                      </tr>
                    ))
                  }
                  {
                    invProduct.map((p, i) => (
                      <tr>
                        <td>Inverter Product</td>
                        <td className={style.violet}>
                          <EditableInput
                            type="text"
                            value={p.product}
                            onChange={handleInvProductData(i, 'product')}
                          />
                        </td>
                        <td className={style.numberTd}>
                          <EditableInput
                            type="integer"
                            value={p.quantity}
                            onChange={handleInvProductData(i, 'quantity')}
                          />
                        </td>
                        <td className={style.addRemoveTd}>
                          { i === (invProduct.length - 1) ?
                            <AddButton onClick={addInvProduct} />
                            :
                            <RemoveButton onClick={removeInvProduct(i)} />
                          }
                        </td>
                      </tr>
                    ))
                  }
                  {
                    batProduct.map((p, i) => (
                      <tr>
                        <td>Battery Product</td>
                        <td className={style.violet}>
                          <EditableInput
                            type="text"
                            value={p.product}
                            onChange={handleBatProductData(i, 'product')}
                          />
                        </td>
                        <td className={style.numberTd}>
                          <EditableInput
                            type="integer"
                            value={p.quantity}
                            onChange={handleBatProductData(i, 'quantity')}
                          />
                        </td>
                        <td className={style.addRemoveTd}>
                          { i === (batProduct.length - 1) ?
                            <AddButton onClick={addBatProduct} />
                            :
                            <RemoveButton onClick={removeBatProduct(i)} />
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className={style.heading} style={{ marginTop: '20px' }}>
                YOUR BATTERY COSTS AND ESTIMATED SAVINGS
              </div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Cost of Power</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="float"
                        value={oppData.Cost_of_Power_ex_GST__c}
                        onChange={handleOppData('Cost_of_Power_ex_GST__c')}
                        prefix="$"
                        suffix="/kWh"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Daily supply charge</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="float"
                        value={oppData.Daily_Supply_Charge_ex_GST__c}
                        onChange={handleOppData('Daily_Supply_Charge_ex_GST__c')}
                        prefix="$"
                        suffix="/Day"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Feed-in Tariff</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="float"
                        value={oppData.Feed_in_tariff__c}
                        onChange={handleOppData('Feed_in_tariff__c')}
                        prefix="$"
                        suffix="/kWh"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Predicted Energy Price Rise</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="float"
                        value={oppData.PredictedAnnualRiseInPowerCost__c}
                        onChange={handleOppData('PredictedAnnualRiseInPowerCost__c')}
                        suffix="% p.a."
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Average Daily Energy Usage</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={oppData.AverageDailyUsage__c}
                        onChange={handleOppData('AverageDailyUsage__c')}
                        suffix="kWh"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Approx. Quarterly Energy Use</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={missData.approxQuarterlyEnergyUse}
                        onChange={handleMissData('approxQuarterlyEnergyUse')}
                        suffix="kWh"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Day Usage</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={oppData.DayUsagePercentage__c}
                        onChange={handleOppData('DayUsagePercentage__c')}
                        suffix="%"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Night Usage</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={oppData.NightUsagePercentage__c}
                        onChange={handleOppData('NightUsagePercentage__c')}
                        suffix="%"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Average 1st year quarterly savings*</td>
                    <td className={style.green}>${getFirstYearQuarterlySavings()}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Estimated first year savings*</b>
                    </td>
                    <td className={style.green}>
                      <b>${getEstimatedFirstYearSavings()}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Return On Investment**</b>
                    </td>
                    <td className={style.green}>
                      <b>{oppData.PaybackPeriod__c} Years</b>
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
                    <td className={style.green}>{oppData.AverageDailyProduction__c} kWh</td>
                  </tr>
                  <tr>
                    <td>
                      Approx. 1<sup>st</sup> Year Energy Production
                    </td>
                    <td className={style.green}>{oppData.AverageAnnualProduction__c} kWh</td>
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
              {oppData.SavingsList__c && (
                <div className={style.chartContainer}>
                  <Chart1
                    data={{
                      Savings: JSON.parse(oppData.SavingsList__c)
                    }}
                  />
                </div>
              )}
              {oppData.Annual_Production__c && (
                <div className={style.chartContainer}>
                  <Chart2 data={JSON.parse(oppData.Annual_Production__c)} />
                </div>
              )}
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
                    <td className={style.violet}>
                      <EditableInput
                        type="text"
                        value={oppData.Address_Line_1__c}
                        onChange={handleOppData('Address_Line_1__c')}
                        onBlur={oppDataBlur}
                      />
                      <br />
                      <EditableInput
                        type="text"
                        value={oppData.Address_Line_2__c}
                        onChange={handleOppData('Address_Line_2__c')}
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Multi Storey</td>
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.Multi_storey__c}
                        onChange={handleOppData('Multi_storey__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Split Count</td>
                    <td className={style.yellow}>{oppData.Split_Count__c}</td>
                  </tr>
                  <tr>
                    <td>Steep Roof (>30)</td>
                    {/* TODO: wrong variable */}
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.KlipLok_Roof_Panel_Installtion__c}
                        onChange={handleOppData('KlipLok_Roof_Panel_Installtion__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Meter Isolator</td>
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.Meter_Isolator__c}
                        onChange={handleOppData('Meter_Isolator__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Cherry Picker Required</td>
                    {/* TODO: wrong variable */}
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.KlipLok_Roof_Panel_Installtion__c}
                        onChange={handleOppData('KlipLok_Roof_Panel_Installtion__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Roof Mount Type</td>
                    <td className={style.violet}>{oppData.Roof_Type__c}</td>
                  </tr>
                  <tr>
                    <td>Electricity Provider</td>
                    <td className={style.yellow}>--</td>
                  </tr>
                  <tr>
                    <td>Meter Number</td>
                    <td className={style.yellow}>{oppData.Meter_Number__c}</td>
                  </tr>
                  <tr>
                    <td>Number of Phases</td>
                    <td className={style.yellow}>{oppData.Number_of_Phases__c}</td>
                  </tr>
                  <tr>
                    <td>National Meter Identifier (NMI)</td>
                    <td className={style.yellow}>{oppData.NMI__c}</td>
                  </tr>
                </tbody>
              </table>
              <div className={`${style.heading} ${style.yourPaymentDetails}`}>YOUR PAYMENT DETAILS</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Cost of System (excluding GST)*</td>
                    <td className={style.green}>${oppData.TotalSystemCostExclGST__c}</td>
                  </tr>
                  <tr>
                    <td>GST</td>
                    <td className={style.green}>${oppData.GST__c}</td>
                  </tr>
                  <tr>
                    <td>Promo Discount</td>
                    <td className={style.red}>$--</td>
                  </tr>
                  <tr>
                    <td>STC Discount</td>
                    <td className={style.green}>${oppData.STCDiscount__c}</td>
                  </tr>
                  <tr style={{ height: '75px' }}>
                    <td>
                      <b>SALE PRICE</b> (After Discounts/Rebates)
                    </td>
                    <td className={style.green}>
                      <b>$--</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Deposit Amount</b>
                    </td>
                    <td className={style.green}>${oppData.DepositAmount__c}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Balance Due On Day Of Install Via Rate Setter Finance</b>
                    </td>
                    <td>${oppData.BalanceDueOnCompletion__c}</td>
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
                  <Map
                    address={fullAddress}
                    containerStyle={{
                      position: 'relative',
                      width: '100%',
                      height: '400px'
                    }}
                  />
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

export default withSnackbar(Invoice);
