import CryptoJS from 'crypto-js';

export const secretKey = "123456";

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (data) => {
    try {
        const bytes = CryptoJS.AES.decrypt(data, secretKey);
        if (bytes.sigBytes === -1) {
            return null; // Descriptografia falhou
        }
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Erro na descriptografia:", error);
        return null;
    }
};
