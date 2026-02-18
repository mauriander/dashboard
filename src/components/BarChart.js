import React from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';


function BarChart({chartData}){
return <Bar data = {chartData}/>
//return<p>anda </p>

}

export default BarChart;



// export default class BarChart extends Component {
//   render() {
//     return (
//       <div>BarChart</div>
//     )
//   }
// }
