import { Request,Response,NextFunction } from "express";

export type controllerType =  ( 
    req: Request<any>,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;




// Define the UserRequest type for incoming request bodies
export type UserRequest =  {
  email: string;
  password: string;
  username: string;
  financialGoals?: {
    shortTerm?: string;
    longTerm?: string;
  };
  riskAppetite?: 'low' | 'medium' | 'high';
  portfolio?: {
    stockSymbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate?: Date | string; // Allow string for flexibility (parsed to Date later)
  }[];
  taxProfile?: {
    country?: string;
    taxBracket?: string;
  };
}



export type userSignInRequest ={
    email : string,
    password : string
}


export type updateStocks = {
    portfolio: {
        stockSymbol: string;
        quantity: number;
        purchasePrice: number;
        purchaseDate?: Date | string;
      }[];
}

