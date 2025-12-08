import crypto from "crypto";


export const createOrderNumberAdapter = (): string => {

    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    return `ORD-${date}-${random}`;
}