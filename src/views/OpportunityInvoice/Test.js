// <div className={style.page}>
//         <h4>Test</h4>
//         <table className={style.table}>
//           <tbody>
//             <tr>
//               <td>System Efficiency</td>
//               <td className={style.editTd}>
//                 <EditableInput
//                   type="integer"
//                   value={oppData.SystemEfficiency__c}
//                   onChange={handleOppData('SystemEfficiency__c')}
//                   onBlur={oppDataBlur}
//                 />
//               </td>
//             </tr>
//             <tr>
//               <td>Predicted Annual Rise In FeedinTarrif</td>
//               <td className={style.editTd}>
//                 <EditableInput
//                   type="float"
//                   value={oppData.PredictedAnnualRiseInFeedInTarrif__c}
//                   onChange={handleOppData('PredictedAnnualRiseInFeedInTarrif__c')}
//                   suffix="% p.a."
//                   onBlur={oppDataBlur}
//                 />
//               </td>
//             </tr>
//             <tr>
//               <td>Inital Cost</td>
//               <td className={style.editTd}>
//                 // --
//                 {/* <EditableInput
//                   type='integer'
//                   value={chart1Data.InitialCost}
//                   onChange={handleChart1Input('InitialCost')}
//                 /> */}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <br />
//       </div>
//       <br />
//       <hr />


// <tr>
//   <td className={style.editLabel}>Number of Panels</td>
//   <td className={style.violet}>
//     <EditableInput
//       type="integer"
//       value={missData.numberOfPanels}
//       onChange={handleMissData('numberOfPanels')}
//     />
//   </td>
//   <td className={style.hidden}>&nbsp;</td>
//   <td className={style.hidden}>&nbsp;</td>
// </tr>