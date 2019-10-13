import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { PDFExport } from '@progress/kendo-react-pdf';
import style from './style.module.scss';
import './print.scss';
import api from '../../common/api'
import Sidebar from './components/Sidebar';
import Chart1 from './components/Charts/Chart1';
import Chart2 from './components/Charts/Chart2';
import Signature from './components/Signature';

const InvoicePage = () => {
  let resume = React.createRef();
  const [sign, setSign] = useState('');
  const [signModal, setSignModal] = useState(false);
  const [data, setData] = useState({
    SystemSize: 5,
    SystemEfficiency: 60
  });
  const [solarSystemProductionData, setSolarSystemProductionData] = useState(null);

  const updateSolarSystemProductionData = async (body) => {
    try {
      const res = await api.post('/getSolarSystemProduction', body);
      console.log(res.data);
      setSolarSystemProductionData(res.data);
    } catch (err) {
      console.log(err);
      setSolarSystemProductionData(null);
      return err;
    }
  };

  useEffect(() => {
    setSolarSystemProductionData(null);
    updateSolarSystemProductionData(data);
  }, [data]);

  const exportPDF = () => {
    resume.save();
  };

  const openModal = () => setSignModal(true);
  const closeModal = () => setSignModal(false);

  return (
    <React.Fragment>
      {/* <button onClick={() => setData({ ...data, SystemSize: data.SystemSize + 1 })}>Change System Size</button> */}
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
              <div>Your Address</div>
              <div>Your City</div>
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
                    <td>8.2kW</td>
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
                    <td>$0.35/kWh</td>
                  </tr>
                  <tr>
                    <td>Daily supply charge</td>
                    <td>$0.88/Day</td>
                  </tr>
                  <tr>
                    <td>Feed-in Tariff</td>
                    <td>$0.160/kWh</td>
                  </tr>
                  <tr>
                    <td>Predicted Energy Price Rise</td>
                    <td>3.00% p.a.</td>
                  </tr>
                  <tr>
                    <td>Average Daily Energy Usage</td>
                    <td>23.00kWH</td>
                  </tr>
                  <tr>
                    <td>Approx. Quarterly Energy Use</td>
                    <td>2,070.00 kWH</td>
                  </tr>
                  <tr>
                    <td>Day Usage</td>
                    <td>30%</td>
                  </tr>
                  <tr>
                    <td>Night Usage</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>Average 1st year quarterly savings*</td>
                    <td>$601.14</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Estimated first year savings*</b>
                    </td>
                    <td>
                      <b>$2,404.54</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Return On Investment**</b>
                    </td>
                    <td>
                      <b>4.68 Years</b>
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
                    <td>31.39kWh</td>
                  </tr>
                  <tr>
                    <td>
                      Approx. 1<sup>st</sup> Year Energy Production
                    </td>
                    <td>11,457.35kWh</td>
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
                <div className={style.chart}>
                  <div className={style.heading2}>Return on Investment & Savings Analysis*</div>
                  <Chart1 />
                </div>
              </div>
              <div className={style.chartContainer}>
                <div className={style.chart}>
                  <div className={style.heading2}>Estimated Average Daily Power Production (kWh)*</div>
                  <Chart2 data={solarSystemProductionData} />
                </div>
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
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Split Count</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Steep Roof (>30)</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Meter Isolator</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Cherry Picker Required</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Roof Mount Type</td>
                    <td>Rack (Tin)</td>
                  </tr>
                  <tr>
                    <td>Electricity Provider</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Meter Number</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Number of Phases</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>National Meter Identifier (NMI)</td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
              <div className={`${style.heading} ${style.yourPaymentDetails}`}>YOUR PAYMENT DETAILS</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Cost of System (excluding GST)*</td>
                    <td>$16,488.00</td>
                  </tr>
                  <tr>
                    <td>GST</td>
                    <td>$1,482.21</td>
                  </tr>
                  <tr>
                    <td>Promo Discount</td>
                    <td>$1,665.90</td>
                  </tr>
                  <tr>
                    <td>STC Discount</td>
                    <td>$4,884.00</td>
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
                    <td>$0.00</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Balance Due On Day Of Install Via Rate Setter Finance</b>
                    </td>
                    <td>$11,499.51</td>
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
                <div className={style.chart} style={{ padding: '2% 10%' }}>
                  <div className={style.heading2}>Proposed Solar Panel Layout</div>
                  <img src="/images/dummy3.png" alt="dummy-3" style={{ width: '100%' }} />
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

export default InvoicePage;
