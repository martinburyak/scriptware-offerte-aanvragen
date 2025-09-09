'use strict';

const plunet = require('@scrptwr/plunet');

exports.handler = async ({httpMethod}) => {
  try {
    if (httpMethod === 'OPTIONS') return response(200);
    if (httpMethod !== 'GET') return response(405, 'GET request expected');

    const requestId = await addRequest();
    const requestNo = await getRequestNo(requestId);

    return response(200, {
      id: requestId,
      no: requestNo
    });
  } catch (error) {
    console.log(error);
    return response(500);
  }
}

async function addRequest(event) {
  const response = await plunet.addRequest({
    status: 'In preparation'
  });

  if (response.statusCode !== 0) throw Error(`Error adding request: ${response.statusMessage}`);

  return response.data;
}

async function getRequestNo(requestId) {
  const response = await plunet.getRequestNo({
    id: requestId
  });

  if (response.statusCode !== 0) throw Error(`Error getting request number: ${response.statusMessage}`);

  return response.data;
}

function response(statusCode, body, headers) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env['ALLOW_ORIGIN'],
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Request-Headers': '*'
  }

  if (typeof body === 'object') body = JSON.stringify(body);

  return {
    statusCode,
    headers: { ...headers, ...corsHeaders },
    body
  };
}