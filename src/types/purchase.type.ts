import { Payment } from "./payment.type"
import { Product } from "./product.type"

export type Purchase = {
    id: string,
    amount: number,
    product: Product,
    payment: Payment
}