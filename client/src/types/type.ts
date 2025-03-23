export type UserDataType = {
    username : string,
    investmentBudget : number,
    riskTaking : 'low' | 'medium'| 'high',
    gains : string
}

export type InvestmentType = {
    investment: {
        name: string
        quantity: number,
        pricePerQuantity : number
    }[];
};



export type ProfitLossData =  {
    month: string;
    value: number;
  }
  


