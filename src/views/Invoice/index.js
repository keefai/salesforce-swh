import React from 'react';
import Grid from '@material-ui/core/Grid';
import style from './style.module.scss';

const InvoicePage = () => {
  return (
    <div className={style.page}>
      <Grid container spacing={3}>
        <Grid item xs={4} className={style.logotitle}>
          YOUR SOLAR QUOTE
        </Grid>
        <Grid item xs={4}>
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
          </table>
          <br />
          <div className={style.heading}>YOUR BATTERY COSTS AND ESTIMATED SAVINGS</div>
          <table className={style.table}>
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
              <td><b>Estimated first year savings<sup>*</sup></b></td>
              <td><b>$2,404.54</b></td>
            </tr>
            <tr>
              <td><b>Return On Investment<sup>**</sup></b></td>
              <td><b>4.68 Years</b></td>
            </tr>
          </table>
          <br />
          <div className={style.heading}>YOUR ENERGY PRODUCTION ESTIMATES</div>
          <table className={style.table}>
            <tr>
              <td>Average Daily Energy Production</td>
              <td>31.39kWh</td>
            </tr>
            <tr>
              <td>Approx. 1<sup>st</sup> Year Energy Production</td>
              <td>11,457.35kWh</td>
            </tr>
          </table>
          <br />
          <div className={style.heading}>YOUR WARRANTIES</div>
          <table className={style.table2}>
            <tr>
              <td>Panels</td>
            </tr>
            <tr>
              <td>LG offer an industry leading 25 year product warranty and a 25 year power output warranty. <br /> For more information on their products and warranties please click <a href='#'>here</a></td>
            </tr>
            <tr>
              <td>Panels</td>
            </tr>
            <tr>
              <td>LG offer an industry leading 25 year product warranty and a 25 year power output warranty. <br /> For more information on their products and warranties please click <a href='#'>here</a></td>
            </tr>
            <tr>
              <td>Panels</td>
            </tr>
            <tr>
              <td>LG offer an industry leading 25 year product warranty and a 25 year power output warranty. <br /> For more information on their products and warranties please click <a href='#'>here</a></td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={6}>
          <div className={style.chartContainer}>
            <div className={style.chart}>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
            </div>
          </div>
          <div className={style.chartContainer}>
            <div className={style.chart}>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <small>*All savings calculations and ROI are only estimations and vary based on actual usage. The ROI does not include any finance related costs.</small>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className={style.heading}>YOUR INSTALL DETAILS</div>
          <table className={style.table}>
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
          </table>
          <br />
          <div className={style.heading}>YOUR PAYMENT DETAILS</div>
          <table className={style.table}>
            <tr>
              <td>Cost of System (excluding GST)<sup>*</sup></td>
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
            <tr rowspan='3'>
              <td><b>SALE PRICE</b> (After Discounts/Rebates)</td>
              <td>$11,499.51</td>
            </tr>
            <tr>
              <td>Deposit Amount</td>
              <td>$0.00</td>
            </tr>
            <tr>
              <td>Balance Due On Day Of Install Via Rate Setter Finance</td>
              <td>$11,499.51</td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={6}>
          <div className={style.chartContainer}>
            <div className={style.chart}>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
            </div>
          </div>
          <div className={style.chartContainer}>
            <div className={style.chart}>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
              <h1>Hello</h1>
            </div>
          </div>
        </Grid>
      </Grid>
      <br />
      <br />
      <Grid container spacing={3}>
        <div>
          <b>Payment Terms</b>
          <p>
            Something Something.
          </p>
          <p>
            Something Something.
            </p>
        </div>
        <br />
        <table className={style.table3}>
          <thead>
            <th>Full Payment Upfront</th>
            <th>Credit Card Payment</th>
            <th>Direct Transfer</th>
          </thead>
          <tbody>
            <tr>
              <td>Free Anniversary Clean & System Health Check Valued at $299</td>
              <td>Visa and MasterCard accepted Payments incur a 2% surcharge.</td>
              <td>Solar Warehouse Australia<br />BSD: 065 150 AC: 1070 4370</td>
            </tr>
          </tbody>
        </table>
        <br />
             <p>
            Something Something.
            </p>
        <br />
        <table className={style.table3}>
          <thead>
            <th>Full Payment Upfront</th>
            <th>Credit Card Payment</th>
            <th>Direct Transfer</th>
          </thead>
          <tbody>
            <tr>
              <td>Free Anniversary Clean & System Health Check Valued at $299</td>
              <td>Visa and MasterCard accepted Payments incur a 2% surcharge.</td>
              <td>Solar Warehouse Australia<br />BSD: 065 150 AC: 1070 4370</td>
            </tr>
          </tbody>
        </table>
      </Grid>

    </div>
  );
};

export default InvoicePage;
