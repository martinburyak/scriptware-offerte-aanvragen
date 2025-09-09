'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

exports.handler = async request => {
  try {
    if (request.httpMethod === 'OPTIONS') return response(200);

    validateRequest(request);

    const client = new S3Client({
      region: 'eu-central-1',
      credentials:{
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
      }
    });

    const uniqId = uuidv4()

    const command = new PutObjectCommand({
      Bucket: 'scriptware-requests',
      Key: `${request.body.requestNo}/${uniqId}/${request.body.fileName}`
    });
  
    const preSignedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: preSignedUrl
      })
    }
  } catch (error) {
    return await errorHandler(error);
  }
}

function validateRequest(request) {
  validate(request.httpMethod !== 'POST', 405, 'POST request expected');
  validate(request.headers['content-type'] !== 'application/json', 400, `Header 'Content-Type' with value 'application/json' expected`);

  try {
    request.body = JSON.parse(request.body);
  } catch (error) {
    throw new ErrorResponse(400, 'Valid JSON body expected')
  }

  validate(typeof request.body.fileName !== 'string', 400, `JSON field 'fileName' of type 'string' expected`);
  validate(typeof request.body.requestNo !== 'string', 400, `JSON field 'requestNo' of type 'string' expected`);
}

function validate(rule, statusCode, message) {
  if (rule) throw new ErrorResponse(statusCode, message);
}

function response(statusCode, body, headers) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env['ALLOW_ORIGIN'],
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Request-Headers': '*'
  }

  return {
    statusCode,
    headers: { ...headers, ...corsHeaders },
    body
  };
}

class ErrorResponse extends Error {
  constructor(statusCode, message, mailSubject, mailTitle, mailMessage) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ErrorResponse";
    this.mailSubject = mailSubject;
    this.mailTitle = mailTitle;
    this.mailMessage = mailMessage;
  }
}

async function errorHandler(error) {
  const {name, statusCode, message, mailSubject, mailTitle, mailMessage} = error;

  if (name === 'ErrorResponse') {
    return response(statusCode, statusCode === 500 ? null : message);
  }

  console.log(error);

  return response(500);
}