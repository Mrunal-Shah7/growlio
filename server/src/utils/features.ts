// interface TradeResult {
//     returns: number[];
//     riskFreeRate: number;
//   }

import mongoose from "mongoose"

  
//   function calculateSharpeRatio({ returns, riskFreeRate }: TradeResult): number {
//     const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
//     const stdDev = Math.sqrt(
//       returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length
//     );
//     return (meanReturn - riskFreeRate) / stdDev;
//   }
  
//   export { calculateSharpeRatio };



export const connectDB = (uri : string)=>{
    mongoose.connect(uri,{
        dbName : "growlio"
    }).then(c=>console.log("Db Connected"))
    .catch((e)=>console.log(e))
}