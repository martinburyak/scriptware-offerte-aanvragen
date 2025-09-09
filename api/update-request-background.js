'use strict';

const plunet = require('@scrptwr/plunet');
const mail = require('@sendgrid/mail');

const languages = require('../src/data/languages.json');
const countries = require('../src/data/countries.json');

mail.setApiKey(process.env['SENDGRID_API_KEY']);

exports.handler = async ({httpMethod: method, headers, body}, context) => {
  try {
    body = validateHttpRequest(method, headers, body);

    await setRequestName(body.request.id, body.locale, body.sourceLanguage, body.targetLanguages);
    await setRequestDescription(body.request.id, body.locale, body.additional, body.level, body.files, headers['x-nf-client-connection-ip'], body.companyName, body.firstName, body.lastName, body.emailAddress, body.phoneNumber, body.country, body.gclid);
    await setRequestCustomer(body.request.id, body.emailAddress, body.companyName, body.firstName, body.lastName, body.phoneNumber, body.country);
    await setProperty(body.request.id, 'Payment time', 1);
    await setProperty(body.request.id, 'Source of request', 1);
    await setProperty(body.request.id, 'Request a review', 2);
    await setCampaign(body.request.id, body.campaign);
    await setRequestLanguageCombinations(body.request.id, body.sourceLanguage, body.targetLanguages);
    await setRequestCategory(body.request.id);

    if (body.level === 'budget') await setProperty(body.request.id, 'Translation level', 1);
    if (body.level === 'basic') await setProperty(body.request.id, 'Translation level', 2);
    if (body.level === 'plus') await setProperty(body.request.id, 'Translation level', 3);
    if (body.level === 'premium') await setProperty(body.request.id, 'Translation level', 4);

    await notifyCustomer(body.request.no, body.emailAddress, body.locale);
  } catch (error) {
    console.log(error);
  }
}

const setCampaign = async (requestId, campaignName) => {
  if (!campaignName) return;

  const campaigns = {
    'performancemax': 1,
    'dsa': 2,
    'branded': 3,
    'beedigd': 4,
    'juridisch': 5,
    'vertaalbureau': 6,
    'technisch-vertalen': 7,
    'particulier': 8,
    'website-vertalen': 9
  }

  await setProperty(requestId, 'Ads campaign', campaigns[campaignName]);
}

const setRequestCategory = async requestId => {
  const response = await plunet.setRequestCategory({
    requestId,
    category: 'MLV'
  });

  if (response.statusCode !== 0) throw Error(`Error setting request category: ${response.statusMessage}`);
}

const notifyCustomer = async (requestNo, email, locale) => {
  await mail.send({
    to: email,
    from: 'Scriptware Translations <sales@scriptware.nl>',
    templateId: locale === 'nl' ? 'd-746eaa4370ec470385858ede83b60db3' : 'd-e5fa9347544b4e3db4d604a8694e83a3',
    dynamicTemplateData: {
      request: requestNo
    }
  });
}

const setRequestLanguageCombinations = async (requestId, sourceLanguage, targetLanguages) => {
  for (const targetLanguage of targetLanguages) {
    const response = await plunet.setRequestLanguageCombination({
      requestId,
      sourceLanguage: sourceLanguage.en,
      targetLanguage: targetLanguage.en
    });

    if (response.statusCode !== 0) throw Error(`Error setting request language combination: ${response.statusMessage}`);
  }
}

const setRequestCustomer = async (requestId, emailAddress, companyName, firstName, lastName, phoneNumber, country) => {
  const existingCustomerId = await searchCustomer(emailAddress);

  let customerId, contactId;

  if (existingCustomerId) {
    customerId = existingCustomerId;
    contactId = await searchContact(customerId, emailAddress);
  }

  if (!existingCustomerId) {
    const customerType = companyName ? 'commercial' : 'private';

    if (companyName) {
      customerId = await addCustomer(companyName, '', '', 'Company', '', country.en);
      contactId = await addContact(customerId, lastName, firstName, emailAddress, phoneNumber || '');
    }

    if (!companyName) {
      customerId = await addCustomer(lastName, firstName, emailAddress, 'Mr', phoneNumber || '', country.en);
    }
  }

  await setCustomerPaymentInformation(customerId, country, companyName);
  await connectCustomerToRequest(requestId, customerId);

  if (contactId) await connectContactToRequest(requestId, contactId);
}

const setProperty = async (requestId, name, value) => {
  const options = {
    name,
    value,
    nodeId: requestId,
    nodeType: 'Request'
  }

  const response = await plunet.setProperty(options);

  if (response.statusCode !== 0) throw Error(`Error setting request property: ${response.statusMessage}`);
}

const connectContactToRequest = async (requestId, contactId) => {
  const options = {
    contactId,
    requestId
  }

  const response = await plunet.setRequestContact(options);

  if (response.statusCode !== 0) throw Error(`Error setting request contact: ${response.statusMessage}`);
}

const setRequestContact = async (requestId, contactId) => {
  const options = {
    contactId,
    requestId
  }

  const response = await plunet.setRequestContact(options);

  if (response.statusCode !== 0) throw Error(`Error setting request contact: ${response.statusMessage}`);
}

const connectCustomerToRequest = async (requestId, customerId) => {
  const options = {
    customerId,
    requestId
  }

  const response = await plunet.setRequestCustomer(options);

  if (response.statusCode !== 0) throw Error(`Error setting request customer: ${response.statusMessage}`);
}

const setCustomerPaymentInformation = async (customerId, country, companyName) => {
  const response = await plunet.setCustomerPaymentInformation({
    customerId,
    paymentMethod: 'Direct debit',
    preselectedTax: getPreselectedTax(country, companyName),
    revenueAccount: getRevenueAccount(country, companyName),
    accountsReceivable: companyName ? '' : '1139'
  });

  if (response.statusCode !== 0) throw Error(`Error setting customer payment information: ${response.statusMessage}`);
}

const getPreselectedTax = (country, companyName) => {
  if (country.code === 'NL') {
    return 'Tax 1';
  } else {
    if (country.eu && companyName) return 'Tax 2'; 
    if (country.eu && !companyName) return 'Tax 1';
    if (!country.eu) return 'Tax 3'; 
  }
}

const getRevenueAccount = (country, companyName) => {
  if (country.code === 'NL') {
    return 1
  } else {
    if (!country.eu && companyName) return 3;
    if (companyName && country.eu) return 2;
    if (!companyName) return 1; 
  }
}

const addContact = async (customerId, name1, name2, email, phone) => {
  const response = await plunet.addContact({
    customerId,
    name1,
    name2,
    email,
    phone,
    status: 'Active'
  });

  if (response.statusCode !== 0) throw Error(`Error creating contact: ${response.statusMessage}`);

  return response.data;
}

const addCustomer = async (name1, name2, email, formOfAddress, phone, country) => {
  const response = await plunet.addCustomer({
    name1,
    name2,
    email,
    formOfAddress,
    phone,
    status: 'Active'
  });

  if (response.statusCode !== 0) throw Error(`Error creating customer using: ${response.statusMessage}`);

  const customerId = response.data;

  await addAddress(customerId, country);
  
  return customerId;
}

const addAddress = async (customerId, country) => {
  const response = await plunet.addCustomerAddress({
    customerId,
    country: country,
    type: 'Invoice'
  });

  if (response.statusCode !== 0) {  
    throw 'NOT_CREATE_ADDRESS';
  }

  return response.data;
}

const searchContact = async (customerId, email) => {
  const response = await plunet.getAllContactObjects({ customerId });

  if (response.statusCode !== 0) throw Error(`Error getting all contact objects: ${response.statusMessage}`);

  for (const contact of response.data) {
    if (contact.email === email) return Number(contact.customerContactId);
  }

  return;
}

async function searchCustomer(email) {
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{1,24}$/.test(email);

  if (!isValidEmail) return;
  
  const response =  await plunet.searchCustomer({ email });

  if (response.statusCode !== 0) throw Error(`Unable to search customers: ${response.statusMessage}`);

  if (!response.data) return;

  if (typeof response.data === 'number') return response.data;

  if (Array.isArray(response.data)) {
    const promises = [];

    for (const companyId of response.data) {
      promises.push(getCustomerName(companyId));
    }

    const companyNames = await Promise.all(promises);

    const companyNamesString = companyNames.reduce((previousValue, currentValue, index) => {
      if (companyNames.length - 1 === index) return `${previousValue} en <b>${currentValue}</b>`;
      if (index === 0) return `<b>${currentValue}</b>`;

      return `${previousValue}, <b>${currentValue}</b>`
    }, '');

    await sendMail(`E-mailadres ${email} wordt dubbel gebruikt`, `E-mailadres wordt voor meerdere klanten in Plunet gebruikt`, `Het e-mailadres <b>${email}</b> wordt voor klanten ${companyNamesString} gebruikt. Voeg deze klanten samen.`);

    return response.data[response.data.length - 1];
  }
}

async function getCustomerName(customerId) {
  const response = await plunet.getCustomer({ customerId });

  if (response.statusCode !== 0) throw Error(`Error getting customer: ${response.statusMessage}`);

  if (response.data.formOfAddress === 'Company') return response.data.name1;

  return `${response.data.name2} ${response.data.name1}`;
}

const setRequestDescription = async (requestId, locale, additional, level, files, clientIp, companyName, firstName, lastName, email, phone, country, gclid) => {
  const descriptionObject = {};

  descriptionObject.additional = additional;

  descriptionObject.files = [];

  if (files.length > 0) {
    files.forEach((file, index) => {
      descriptionObject.files.push(file)
    });
  }

  descriptionObject.customer = {};
  descriptionObject.customer.language = locale === 'nl' ? 'Dutch' : 'English';
  descriptionObject.customer.company = companyName;
  descriptionObject.customer.firstName = firstName;
  descriptionObject.customer.lastName = lastName;
  descriptionObject.level = level;
  descriptionObject.customer.email = email;
  descriptionObject.customer.phone = phone;
  descriptionObject.customer.country = country.en;

  descriptionObject['GCLID'] = gclid;

  descriptionObject.geolocation = await getGeolocation(clientIp);

  const description = JSON.stringify(descriptionObject, null, 2);
 
  const response = await plunet.setRequestDescription({requestId, description});

  if (response.statusCode !== 0) throw Error(`Error setting request contact: ${response.statusMessage}`);
}

const getGeolocation = async (ip) => {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);

    const body = await response.json();

    body.ip = body.query;

    delete body.query;
    delete body.status;
    delete body.countryCode;
    delete body.region;
    delete body.timezone;

    return body;    
  } catch (error) {
    console.log(error);
    

    return {}
  }
}

const setRequestName = async (requestId, locale, sourceLanguage, targetLanguages) => {
  const name = locale === 'nl'
               ? `Vertaling van ${sourceLanguage.nl} naar ${targetLanguages.map(language => language.nl).join(', ')}`
               : `Translation from ${sourceLanguage.en} to ${targetLanguages.map(language => language.en).join(', ')}`

  const response = await plunet.setRequestName({requestId, name});

  if (response.statusCode !== 0) throw Error(`Error setting request contact: ${response.statusMessage}`);
}

const validateHttpRequest = (method, headers, body) => {
  validate(method !== 'POST', 'POST request expected');
  validate(headers['content-type'] !== 'application/json', `Header 'Content-Type' with value 'application/json' expected`);

  try {
    body = JSON.parse(body);
  } catch (error) {
    throw new Error('Valid JSON body expected')
  }

  validate(typeof body.request !== 'object', `JSON field 'request' of type 'object' expected`);
  validate(typeof body.request.id !== 'number', `JSON field 'request.id' of type 'number' expected`);
  validate(typeof body.request.no !== 'string', `JSON field 'request.no' of type 'string' expected`);
  validate(typeof body.locale !== 'string', `JSON field 'locale' of type 'string' expected`);
  validate(!['nl', 'en'].includes(body.locale),`Invalid value of '${body.locale}' for JSON field 'locale'`);
  validate(typeof body.firstName !== 'string', `JSON field 'firstName' of type 'string' expected`);
  validate(typeof body.lastName !== 'string', `JSON field 'lastName' of type 'string' expected`);
  validate(typeof body.emailAddress !== 'string', `JSON field 'emailAddress' of type 'string' expected`);
  validate(typeof body.sourceLanguage !== 'string', `JSON field 'sourceLanguage' of type 'string' expected`);
  validate(!validLanguage(body.sourceLanguage), `Invalid value of '${body.sourceLanguage}' for JSON field 'sourceLanguage'`);
  validate(!Array.isArray(body.targetLanguages), `JSON field 'targetLanguages' of type 'array' expected`);
  validate(body.targetLanguages.length === 0, `JSON field 'targetLanguages' expects at least one language`);

  for (const targetLanguage of body.targetLanguages) {
    validate(!validLanguage(targetLanguage), `Invalid value of '${targetLanguage}' for JSON field 'targetLanguages'`);
  }

  validate(typeof body.country !== 'string', `JSON field 'country' of type 'string' expected`);
  validate(!validCountry(body.country), `Invalid value of '${body.country}' for JSON field 'country'`)
  validate(typeof body.phoneNumber !== 'string', `JSON field 'phoneNumber' of type 'string' expected`);

  body.sourceLanguage = getLanguage(body.sourceLanguage);
  body.targetLanguages = body.targetLanguages.map(language => getLanguage(language));

  body.country = getCountry(body.country);

  if (body.country.en === 'Netherlands') body.country.en = 'The Netherlands';

  body.files = body.files || [];
  body.additional = body.additional || '';
  body.gclid = body.gclid || '';
  body.companyName = body.companyName || '';
  
  return body;
}

const validate = (rule, message) => {
  if (rule) throw new Error(message);
}

const validLanguage = code => {
  for (const language of languages) {
    if (language.code === code) return true;
  }

  return false;
}

const validCountry = code => {
  for (const country of countries) {
    if (country.code === code) return true
  }

  return false;
}

const getLanguage = code => {
  for (const language of languages) {
    if (language.code === code) return { code, en: language.en, nl: language.nl }
  }
}

const getCountry = code => {
  for (const country of countries) {
    if (country.code === code) return { code, en: country.en, nl: country.nl, eu: country.eu }
  }
}

const sendMail = async (subject, title, message) => {
  try {
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
  } catch (error) {}
}