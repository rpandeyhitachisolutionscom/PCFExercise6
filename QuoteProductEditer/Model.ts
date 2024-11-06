export interface IProduct {
    ProductNumber: string;
    ProductName: string;
    QuoteDetailId: string;
    PricePerUnit: number;
    ExtendedAmount: number;
    UOM: string;
    Quantity: number;
    isSelected: boolean;
    isValidProduct:boolean;
    isUploaded:number;
    Message:string;
}