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
import { formatNumber, difference } from '../../common/helpers';
import Sidebar from './components/Sidebar';
import Chart1 from './components/Charts/Chart1';
import Chart2 from './components/Charts/Chart2';
import Signature from './components/Signature';
import EditableInput from './components/EditableInput';
import Map from './components/Map';
import CreateNew from './components/CreateNew';
import YesNoDropdown from './components/YesNoDropdown';
import DetailsForm from './components/DetailsForm';
import InstallationMap from './components/InstallationMap';
import { ProductTypes, SystemImageTypes, OpportunityRecordType, validURL } from './helpers';
import SelectProducts from './components/SelectProducts';
import { ImageUploadDropzone, ImageDropzone, DivDropzone, MapDropzone } from './components/ImageUpload';

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const sortMonthlyProduction = (data) => {
  const _data = JSON.parse(JSON.stringify(data));
  if (_data && _data.MonthlyProduction) {
    _data.MonthlyProduction.sort((a, b) => {
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  }
  return _data;
}

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

const sampleProduct = {
  Id: null,
  Product2Id: null,
  Quantity: 0
}

const filterAndGetObjects = (products, oProducts, type) => {
  const filteredOp = oProducts.filter((op) => op.Product2.Product_Type__c === type);
  if (filteredOp.length) {
    return filteredOp.map((fop) => ({
      Id: fop.Id,
      Product2Id: fop.Product2.Id,
      Quantity: fop.Quantity
    }));
  }
  return [sampleProduct];
}

const filterProducts = (products, type) => {
  return products.filter((p) => p.Product_Type__c === type);
}

const getLatestSystemImage = (oppImages, type)  => {
  if (oppImages) {
    let filOppImages = oppImages.filter(bb => bb.Type__c === type);
    if (filOppImages && filOppImages.length > 0) {
      filOppImages.sort((a, b) => {
        let keyA = new Date(a.CreatedDate);
        let keyB = new Date(b.CreatedDate);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      return filOppImages[0].ImageURL__c;
    }
    return null;
  }
  return null;
}

const checkRecordType = (oppType, type) => {
  return type.indexOf(oppType.DeveloperName) !== -1;
};

const Invoice = ({ data, account, getAccount, oppProducts, oppType, oppImages, products, ...props }) => {
  let resume = React.createRef();
  const sign = getLatestSystemImage(oppImages, SystemImageTypes.CUSTOMER_SIGNATURE);
  const [signModal, setSignModal] = useState(false);
  const [oppData, setOppData] = useState(data);
  const [accModal, setAccModal] = useState(false);
  const [mapModal, setMapModal] = useState(false);

  const getSpProducts = () => filterAndGetObjects(products, oppProducts, ProductTypes.SOLAR_PANEL);
  const getInvProducts = () => filterAndGetObjects(products, oppProducts, ProductTypes.INVERTER);
  const getBatProducts = () => filterAndGetObjects(products, oppProducts, ProductTypes.BATTERY);
  const [spProduct, setSpProduct] = useState(getSpProducts());
  const [invProduct, setInvProduct] = useState(getInvProducts());
  const [batProduct, setBatProduct] = useState(getBatProducts());

  useEffect(() => {
    setOppData(data);
  }, [data, oppProducts]);

  useEffect(() => {
    setSpProduct(getSpProducts());
    setInvProduct(getInvProducts());
    setBatProduct(getBatProducts());
  }, [oppProducts]);

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
    let newData;
    // handle day night usage
    if (field === 'DayUsagePercentage__c' || field === 'NightUsagePercentage__c') {
      let dayNightUsage;
      if (field === 'DayUsagePercentage__c') {
        dayNightUsage = {
          DayUsagePercentage__c: e.target.value,
          NightUsagePercentage__c: 100 - Number(e.target.value)
        };
      } else {
        dayNightUsage = {
          DayUsagePercentage__c: 100 - Number(e.target.value),
          NightUsagePercentage__c: e.target.value
        };
      }
      newData = {
        ...oppData,
        ...dayNightUsage
      };
    } else {
      newData = {
        ...oppData,
        [field]: e.target.value
      };
    }
    setOppData(newData);
    debouncedSaveData(newData, data);
  };

  const oppDataBlur = () => {
    // debouncedSaveData.flush();
    console.log('On Blur');
  };

  const [missData, setMissData] = useState({
    approxQuarterlyEnergyUse: '--'
  });

  const handleMissData = field => e => {
    setMissData({
      ...missData,
      [field]: e.target.value
    });
  };

  // product apis
  const addOppProduct = (proData) => {
    if (Object.keys(proData).length) {
      api
      .post(`/OpportunityProduct`, {
        ...proData,
        Opportunity: data
      })
      .then(res => {
        console.log(res);
        props.enqueueSnackbar('Product Added', {
          autoHideDuration: 1000
        });
      })
      .catch(err => {
        props.enqueueSnackbar('Error Adding Product', {
          autoHideDuration: 1000
        });
        console.log(err);
      });
    }
  }
  const debouncedAddOppProduct = useCallback(_.debounce(addOppProduct, 2000), []);

  const updateOppProduct = (id, diff, newData) => {
    if (Object.keys(diff).length && id) {
      api
      .patch(`/OpportunityProduct/${id}`, { diff, newData, Opportunity: data })
      .then(res => {
        console.log(res);
        props.enqueueSnackbar('Product Updated', {
          autoHideDuration: 1000
        });
      })
      .catch(err => {
        props.enqueueSnackbar('Error Updating Product', {
          autoHideDuration: 1000
        });
        console.log(err);
      });
    }
  }
  const debouncedUpdateOppProduct = useCallback(_.debounce(updateOppProduct, 2000), []);

  const deleteOppProduct = (id) => {
    if (id) {
      api
      .delete(`/OpportunityProduct/${id}`)
      .then(res => {
        console.log(res);
        props.enqueueSnackbar('Product Deleted', {
          autoHideDuration: 1000
        });
      })
      .catch(err => {
        props.enqueueSnackbar('Error Deleting Product', {
          autoHideDuration: 1000
        });
        console.log(err);
      });
    }
  }

  // solar panel product
  const handleSpProductData = (i, field) => e => {
    const newSp = JSON.parse(JSON.stringify(spProduct));
    newSp[i][field] = e.target.value;

    if (newSp[i].Id === null) {
      if ((newSp[i].Product2Id !== null) && (newSp[i].Quantity > 0)) {
        console.log('CREATE');
        debouncedAddOppProduct(newSp[i])
      } else {
        console.log('Not Eligible For Creation');
      }
    } else {
      console.log('UPDATE');
      const diff = difference(newSp[i], spProduct[i]);
      console.log('PATCH: ', diff);
      debouncedUpdateOppProduct(newSp[i].Id, diff, newSp[i]);
    }

    setSpProduct(newSp);
  }

  const addSpProduct = e => {
    setSpProduct([
      ...spProduct,
      sampleProduct
    ]);
  }

  const removeSpProduct = i => e => {
    const sP = JSON.parse(JSON.stringify(spProduct[i]));
    if (sP.Id) {
      deleteOppProduct(sP.Id);
    }
    const newSp = spProduct.filter((p, pi) => pi !== i);
    setSpProduct(newSp);
  }

  // inverter product
  const handleInvProductData = (i, field) => e => {
    const newInv = JSON.parse(JSON.stringify(invProduct));
    newInv[i][field] = e.target.value;

    if (newInv[i].Id === null) {
      if ((newInv[i].Product2Id !== null) && (newInv[i].Quantity > 0)) {
        console.log('CREATE');
        debouncedAddOppProduct(newInv[i])
      } else {
        console.log('Not Eligible For Creation');
      }
    } else {
      console.log('UPDATE');
      const diff = difference(newInv[i], invProduct[i]);
      console.log('PATCH: ', diff);
      debouncedUpdateOppProduct(newInv[i].Id, diff, newInv[i]);
    }

    setInvProduct(newInv);
  }

  const addInvProduct = e => {
    setInvProduct([
      ...invProduct,
      sampleProduct
    ]);
  }

  const removeInvProduct = i => e => {
    const inv = JSON.parse(JSON.stringify(invProduct[i]));
    if (inv.Id) {
      deleteOppProduct(inv.Id);
    }
    const newInv = invProduct.filter((p, pi) => pi !== i);
    setInvProduct(newInv);
  }

  // battery product
  const handleBatProductData = (i, field) => e => {
    const newBat = JSON.parse(JSON.stringify(batProduct));
    newBat[i][field] = e.target.value;

    if (newBat[i].Id === null) {
      if ((newBat[i].Product2Id !== null) && (newBat[i].Quantity === 0 || newBat[i].Quantity === null)) {
        newBat[i].Quantity = 1;
      }
      if ((newBat[i].Product2Id !== null) && (newBat[i].Quantity > 0)) {
        console.log('CREATE');
        debouncedAddOppProduct(newBat[i])
      } else {
        console.log('Not Eligible For Creation');
      }
    } else {
      console.log('UPDATE');
      const diff = difference(newBat[i], batProduct[i]);
      console.log('PATCH: ', diff);
      debouncedUpdateOppProduct(newBat[i].Id, diff, newBat[i]);
    }

    setBatProduct(newBat);
  }

  const addBatProduct = e => {
    setBatProduct([
      ...batProduct,
      sampleProduct
    ]);
  }

  const removeBatProduct = i => e => {
    const bat = JSON.parse(JSON.stringify(batProduct[i]));
    if (bat.Id) {
      deleteOppProduct(bat.Id);
    }
    const newBat = batProduct.filter((p, pi) => pi !== i);
    setBatProduct(newBat);
  }

  // helpers
  const getFirstYearQuarterlySavings = () => {
    return oppData.SavingsList__c ? (JSON.parse(oppData.SavingsList__c)[0].Total / 4).toFixed(2) : 0.0;
  };

  const getEstimatedFirstYearSavings = () => {
    return oppData.SavingsList__c ? JSON.parse(oppData.SavingsList__c)[0].Total.toFixed(2) : 0.0;
  };

  const uploadSystemImage = (imageObj) => {
      api
      .post(`/OpportunityImages/${data.Id}`, {
        ...imageObj,
        type: SystemImageTypes.SOLAR_PANEL_LAYOUT
      })
      .then(res => {
        console.log(res);
        props.enqueueSnackbar('Solar Panel Layout Updated', {
          autoHideDuration: 1000
        });
      })
      .catch(err => {
        props.enqueueSnackbar('Error Updating Solar Panel Layout', {
          autoHideDuration: 1000
        });
        console.log(err);
      });
  }

  const uploadSignature = async (imageObj) => {
    try {
      const res = api.post(`/OpportunityImages/${data.Id}`, {
        ...imageObj,
        type: SystemImageTypes.CUSTOMER_SIGNATURE
      });
      console.log(res);
      props.enqueueSnackbar('Signature Updated', {
        autoHideDuration: 1000
      });
    } catch (err) {
      props.enqueueSnackbar('Error Updating Signature', {
        autoHideDuration: 1000
      });
      console.log(err);
    }
}

  // render Map
  const renderMap = () => {
    const imageUrl = getLatestSystemImage(oppImages, SystemImageTypes.SOLAR_PANEL_LAYOUT);
    if (imageUrl) {
      return (
        <ImageUploadDropzone
          setImg={uploadSystemImage}
        >
          {active => (
            <ImageDropzone
              src={imageUrl}
              alt="installation-address"
              active={active}
            />
          )}
        </ImageUploadDropzone>
      )
    }

    if ((oppData.Address_Line_1__c === null) || (oppData.Address_Line_1__c.trim().length < 1)) {
      return (
        <ImageUploadDropzone
          setImg={uploadSystemImage}
          noClick={true}
        >
          {active => (
            <DivDropzone
              active={active}
            />
          )}
        </ImageUploadDropzone>
      );
    }

    return (
      <ImageUploadDropzone
        setImg={uploadSystemImage}
        noClick={true}
      >
        {(active, open) => (
          <MapDropzone
            address={oppData.Address_Line_1__c}
            active={active}
            open={open}
          />
        )}
      </ImageUploadDropzone>
    );
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
      <DetailsForm state={accModal} close={() => setAccModal(false)} account={account} getAccount={getAccount} />
      <InstallationMap state={mapModal} close={() => setMapModal(false)} address={oppData.Address_Line_1__c} updateAddress={handleOppData('Address_Line_1__c')} />
      <Sidebar exportPDF={exportPDF} openModal={openModal} />
      <Signature state={signModal} closeModal={closeModal} oppId={data.Id} />
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
            <Grid item md={6} className={style.leftHeader}>
              <span className={style.logotitle}>YOUR SOLAR QUOTE</span>
              <br />
              <span>{data.Id} (salesforce id)</span>
            </Grid>
            <Grid item md={6} className={style.rightHeader}>
              <img src="/images/logos/swa.png" alt="swa-logo" className={style.logo} />
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ marginTop: '25px' }}>
            <Grid item md={6} className={style.leftHeader}>
              <div onClick={() => setAccModal(true)}>
                <div>{account.FirstName} {account.LastName}</div>
                <div>{account.BillingAddress}</div>
                {/* <div>{account.BillingCity}</div> */}
                <div>{account.PersonEmail}</div>
                <div>{account.Phone}</div>
              </div>
              <br />
            </Grid>
            <Grid item md={6} className={style.rightHeader}>
              <div>20 Paul Drive</div>
              <div>Surrey Downs, SA 5004</div>
              <br />
              <div>{oppData.Address_Line_1__c}</div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div>07/09/2019</div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              <div className={style.heading}>YOUR HOME ENERGY SOLUTION</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>System Size</td>
                    <td className={style.green}>
                      {oppData.SystemSize__c}kWH
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
                  {
                    spProduct && checkRecordType(oppType, [OpportunityRecordType.SOLAR_SYSTEM, OpportunityRecordType.SOLAR_BATTERY]) && spProduct.map((p, i) => (
                      <tr key={i}>
                        <td className={style.editLabel}>Solar Panel Product</td>
                        <td className={style.violet}>
                          <SelectProducts
                            options={filterProducts(products, ProductTypes.SOLAR_PANEL)}
                            value={p.Product2Id}
                            onChange={handleSpProductData(i, 'Product2Id')}
                          />
                        </td>
                        <td className={style.numberTd}>
                          <EditableInput
                            inputType="number"
                            min={0}
                            type="integer"
                            value={p.Quantity}
                            onChange={handleSpProductData(i, 'Quantity')}
                          />
                        </td>
                        <td className={style.addRemoveTd}>
                          { (i === (spProduct.length - 1)) && ((p.Id !== null) || (spProduct.length === 1))?
                            <AddButton onClick={addSpProduct} />
                            :
                            <RemoveButton onClick={removeSpProduct(i)} />
                          }
                        </td>
                      </tr>
                    ))
                  }
                  {
                    invProduct &&
                    checkRecordType(oppType, [OpportunityRecordType.SOLAR_SYSTEM, OpportunityRecordType.SOLAR_BATTERY, OpportunityRecordType.BATTERY]) &&
                    invProduct.map((p, i) => (
                      <tr key={i}>
                        <td className={style.editLabel}>Inverter Product</td>
                        <td className={style.violet}>
                          <SelectProducts
                            options={filterProducts(products, ProductTypes.INVERTER)}
                            value={p.Product2Id}
                            onChange={handleInvProductData(i, 'Product2Id')}
                          />
                        </td>
                        <td className={style.numberTd}>
                          <EditableInput
                            inputType="number"
                            min={0}
                            type="integer"
                            value={p.Quantity}
                            onChange={handleInvProductData(i, 'Quantity')}
                          />
                        </td>
                        <td className={style.addRemoveTd}>
                          { (i === (invProduct.length - 1)) && ((p.Id !== null) || (invProduct.length === 1)) ?
                            <AddButton onClick={addInvProduct} />
                            :
                            <RemoveButton onClick={removeInvProduct(i)} />
                          }
                        </td>
                      </tr>
                    ))
                  }
                  {
                    batProduct &&
                    checkRecordType(oppType, [OpportunityRecordType.SOLAR_BATTERY, OpportunityRecordType.BATTERY]) &&
                    batProduct.map((p, i) => (
                      <tr key={i}>
                        <td className={style.editLabel}>Battery Product</td>
                        <td className={style.violet}>
                          <SelectProducts
                            options={filterProducts(products, ProductTypes.BATTERY)}
                            value={p.Product2Id}
                            onChange={handleBatProductData(i, 'Product2Id')}
                          />
                        </td>
                        <td className={style.numberTd}>
                          <EditableInput
                            inputType="number"
                            min={0}
                            type="integer"
                            value={p.Quantity}
                            onChange={handleBatProductData(i, 'Quantity')}
                          />
                        </td>
                        <td className={style.addRemoveTd}>
                          { (i === (batProduct.length - 1)) && ((p.Id !== null) || (batProduct.length === 1)) ?
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
                    <td className={style.editLabel}>Cost of Power</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="float"
                        value={oppData.Cost_of_Power_ex_GST__c}
                        onChange={handleOppData('Cost_of_Power_ex_GST__c')}
                        prefix="$"
                        suffix="/kWH"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Daily supply charge</td>
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
                    <td className={style.editLabel}>Feed-in Tariff</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="float"
                        value={oppData.Feed_in_tariff__c}
                        onChange={handleOppData('Feed_in_tariff__c')}
                        prefix="$"
                        suffix="/kWH"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Predicted Energy Price Rise</td>
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
                    <td className={style.editLabel}>Average Daily Energy Usage</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={oppData.AverageDailyUsage__c}
                        onChange={handleOppData('AverageDailyUsage__c')}
                        suffix="kWH"
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Approx. Quarterly Energy Use</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={oppData.AverageQuarterlyUsage__c}
                        onChange={handleOppData('AverageQuarterlyUsage__c')}
                        suffix="kWH"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Day Usage</td>
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
                    <td className={style.editLabel}>Night Usage</td>
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
                    <td className={style.green}>${formatNumber(getFirstYearQuarterlySavings())}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Estimated first year savings*</b>
                    </td>
                    <td className={style.green}>
                      <b>${formatNumber(getEstimatedFirstYearSavings())}</b>
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
                    <td className={style.green}>{formatNumber(oppData.AverageDailyProduction__c)} kWH</td>
                  </tr>
                  <tr>
                    <td>
                      Approx. 1<sup>st</sup> Year Energy Production
                    </td>
                    <td className={style.green}>{formatNumber(oppData.AverageAnnualProduction__c)} kWH</td>
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
            <Grid item md={6} sm={12}>
              {oppData.SavingsList__c && (
                <div className={style.chartContainer}>
                  <Chart1
                    data={{
                      Savings: JSON.parse(oppData.SavingsList__c)
                    }}
                    annotationData={oppData.TotalSystemCostInclGST__c}
                  />
                </div>
              )}
              {oppData.Annual_Production__c && (
                <div className={style.chartContainer}>
                  <Chart2 data={sortMonthlyProduction(JSON.parse(oppData.Annual_Production__c))} />
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
            <Grid item md={6} sm={12}>
              <div className={style.heading}>YOUR INSTALL DETAILS</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td className={`${style.padding} ${style.min50p}`}>Installation Address</td>
                    <td className={style.violet} onClick={() => setMapModal(true)}>
                      <span>{oppData.Address_Line_1__c}&nbsp;</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Multi Storey</td>
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.Multi_storey__c}
                        onChange={handleOppData('Multi_storey__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Split Count</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={oppData.Split_Count__c}
                        onChange={handleOppData('Split_Count__c')}
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Steep Roof (>30)</td>
                    {/* TODO: wrong variable */}
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.KlipLok_Roof_Panel_Installtion__c}
                        onChange={handleOppData('KlipLok_Roof_Panel_Installtion__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Meter Isolator</td>
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.Meter_Isolator__c}
                        onChange={handleOppData('Meter_Isolator__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Cherry Picker Required</td>
                    {/* TODO: wrong variable */}
                    <td className={style.yellow}>
                      <YesNoDropdown
                        value={oppData.KlipLok_Roof_Panel_Installtion__c}
                        onChange={handleOppData('KlipLok_Roof_Panel_Installtion__c')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Roof Mount Type</td>
                    <td className={style.violet}>
                      <EditableInput
                        type="text"
                        value={oppData.Roof_Type__c}
                        onChange={handleOppData('Roof_Type__c')}
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Electricity Provider</td>
                    <td className={style.yellow}>--</td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Meter Number</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="text"
                        value={oppData.Meter_Number__c}
                        onChange={handleOppData('Meter_Number__c')}
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>Number of Phases</td>
                    <td className={style.yellow}>
                      <EditableInput
                        type="integer"
                        value={oppData.Number_of_Phases__c}
                        onChange={handleOppData('Number_of_Phases__c')}
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={style.editLabel}>National Meter Identifier (NMI)</td>
                    <td className={style.yellow}>
                       <EditableInput
                        type="text"
                        value={oppData.NMI__c}
                        onChange={handleOppData('NMI__c')}
                        onBlur={oppDataBlur}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={`${style.heading} ${style.yourPaymentDetails}`}>YOUR PAYMENT DETAILS</div>
              <table className={style.table}>
                <tbody>
                  <tr>
                    <td>Cost of System (excluding GST)*</td>
                    <td className={style.green}>${formatNumber(oppData.TotalSystemCostExclGST__c)}</td>
                  </tr>
                  <tr>
                    <td>GST</td>
                    <td className={style.green}>${formatNumber(oppData.GST__c)}</td>
                  </tr>
                  <tr>
                    <td>Promo Discount</td>
                    <td className={style.red}>$--</td>
                  </tr>
                  <tr>
                    <td>STC Discount</td>
                    <td className={style.green}>-${formatNumber(oppData.STCDiscount__c)}</td>
                  </tr>
                  {oppData.HBSSubsidy__c > 0 && (
                    <tr>
                      <td>HBS Subsidy</td>
                      <td className={style.green}>-${formatNumber(oppData.HBSSubsidy__c)}</td>
                    </tr>
                  )}
                  <tr style={{ height: '75px' }}>
                    <td>
                      <b>SALE PRICE</b> (After Discounts/Rebates inc GST)
                    </td>
                    <td className={style.green}>
                      <b>${formatNumber(oppData.TotalSystemCostInclGST__c)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Deposit Amount</b>
                    </td>
                    <td className={style.green}>${formatNumber(oppData.DepositAmount__c)}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Balance Due On Day Of Install Via Rate Setter Finance</b>
                    </td>
                    <td>${formatNumber(oppData.BalanceDueOnCompletion__c)}</td>
                  </tr>
                </tbody>
              </table>
            </Grid>
            <Grid item md={6} sm={12}>
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
                  {renderMap()}
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
                      BSB: 065 150 AC: 1070 4370
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
      <Map
        latLng={{
          lat: 0,
          lng: 0
        }}
        containerStyle={{
          display: 'none'
        }}
      />
    </React.Fragment>
  );
};

export default withSnackbar(Invoice);
