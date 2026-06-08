"use strict";

const axios = require('axios');
const crypto = require('crypto');

class PaymentService {
    constructor() {
        // this.partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMOLW1620250725_TEST'; // Default sandbox
        // this.accessKey = process.env.MOMO_ACCESS_KEY || 'pM4xiSFoxY5vJDNf';
        // this.secretKey = process.env.MOMO_SECRET_KEY || 'OoLCDANb5EF91a3XAeBwBcXLIDVsuBNW';
        // this.endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
        this.partnerCode = process.env.MOMO_PARTNER_CODE; // Default sandbox
        this.accessKey = process.env.MOMO_ACCESS_KEY;
        this.secretKey = process.env.MOMO_SECRET_KEY;
        this.endpoint = process.env.MOMO_ENDPOINT;
    }

    generateSignature(rawHash) {
        return crypto
            .createHmac('sha256', this.secretKey)
            .update(rawHash)
            .digest('hex');
    }

    async createPayment({ amount, orderId, orderInfo, redirectUrl, ipnUrl, requestId, extraData = "" }) {
        const requestType = "captureWallet";

        const rawHash = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = this.generateSignature(rawHash);

        const requestBody = {
            partnerCode: this.partnerCode,
            accessKey: this.accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData,
            requestType,
            signature,
            lang: 'vi'
        };

        try {
            const response = await axios.post(this.endpoint, requestBody);
            return response.data;
        } catch (error) {
            console.error('MoMo Create Payment Error:', error.response ? error.response.data : error.message);
            throw new Error('MoMo Payment Creation Failed');
        }
    }

    verifySignature(momoResponse) {
        const { orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = momoResponse;
        const rawHash = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData || ""}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${this.partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
        const checkSignature = this.generateSignature(rawHash);
        return checkSignature === signature;
    }
}

module.exports = new PaymentService();
