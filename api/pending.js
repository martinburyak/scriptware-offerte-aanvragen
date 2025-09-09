'use strict';

const mail = require('@sendgrid/mail');
const plunet = require('@scrptwr/plunet');

mail.setApiKey(process.env['SENDGRID_API_KEY']);

exports.handler = async function(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return response(200);

    validateRequest(event);

    const request = await getRequest(event.body.requestNo);

    checkStatus(request);

    await setRequestStatus(request);

    return response(200);
  } catch (error) {
    return await errorHandler(error);
  }
}

async function setRequestStatus({id, no}) {
  const response = await plunet.setRequestStatus({ requestId: id, status: 'Pending' });

  if (response.statusCode !== 0) {
    throw new ErrorResponse(
      500,
      `Error setting request status: ${response.statusMessage}`,
      `Kan de status van Aanvraag ${no} niet instellen op Openstaand`,
      `Kan de status niet instellen op Openstaand`,
      `Het is niet gelukt de status van Aanvraag <b>${no}</b> aan te passen van <i>In voorbereiding</i> naar <i>Openstaand</i>, omdat iemand de Aanvraag heeft openstaan in Plunet BusinessManager. Svp. de status handmatig aanpassen naar <i>Openstaand</i> en de Offerte maken.`
    );
  }
}

function checkStatus({status, no}) {
  if (status !== 'In preparation') throw new ErrorResponse(400, `Status 'In preparation' for Request ${no} expected`);
} 

async function getRequest(no) {
  const response = await plunet.getRequestByNo({ no });

  if (response.statusCode !== 0) {
    throw new ErrorResponse(
      500,
      `Error retrieving Request: ${response.statusMessage}`,
      `Kan de status van Aanvraag ${no} niet instellen op Openstaand`,
      `Kan de status van Aanvraag ${no} niet instellen op Openstaand`,
      `Het is niet gelukt de status van Aanvraag <b>${no}</b> aan te passen van <i>In voorbereiding</i> naar <i>Openstaand</i>. Svp. de status handmatig aanpassen naar <i>Openstaand</i> en de Offerte maken.`
    );
  }
  
  response.data.no = no;

  return response.data;
}

function validateRequest(event) {
  validate(event.httpMethod !== 'POST', 400, 'POST request expected');
  validate(event.headers['content-type'] !== 'application/json', 400, `Header 'Content-Type' with value 'application/json' expected`);
  
  try {
    event.body = JSON.parse(event.body);
  } catch (error) {
    throw new ValidationError(400, 'Valid JSON body expected')
  }

  validate(typeof event.body.requestNo !== 'string', 400, `JSON field 'requestNo' of type 'string' expected`);
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

async function sendMail(subject, title, message) {
  await mail.send({
    to: process.env['ERROR_EMAIL'],
    from: 'Website <noreply@scriptware.nl>',
    templateId: 'd-7cc23d30b3734bf5908a465b937ef93d',
    dynamicTemplateData: {
      subject: subject,
      title: title,
      paragraphs: [message]
    }
  })
}

async function errorHandler(error) {
  const {name, statusCode, message, mailSubject, mailTitle, mailMessage} = error;

  if (name === 'ErrorResponse') {
    if (mailSubject && mailTitle && mailMessage) sendMail(mailSubject, mailTitle, mailMessage);

    console.log(message);

    return response(statusCode, statusCode === 500 ? null : message);
  }

  console.log(error);

  //sendmail

  return response(500);
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