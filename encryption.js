import crypto, { createHash } from 'crypto'
import config from './config.js'

const {env, port, secret_key, secret_iv, encryption_method} = config

if(!secret_key || !secret_iv || !encryption_method){
    throw new Error('secretKey, secretIv, and encryptionMethod are required')
}

const key = crypto
        .createHash('sha512')
        .update(secret_key)
        .digest('hex')
        .substring(0, 32)

const encryptionIV = crypto
        .createHash('sha512')
        .update(secret_iv)
        .digest('hex')
        .substring(0, 16)

export function encryptData(data){
    const cipher = crypto.createCipheriv(encryption_method, key, encryptionIV)
    let encryptedData = cipher.update(data, 'utf8', 'hex')
    encryptedData += cipher.final('hex') //encrypts data and converts to hex and base64
    return encryptedData
}

export function decryptData(encryptedData){
    const decipher = crypto.createDecipheriv(encryption_method, key, encryptionIV)
    let decipherData = decipher.update(encryptedData, 'hex', 'utf8') 
    decipherData += decipher.final('utf8')
    return decipherData
}