exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { pacote, valor, email } = JSON.parse(event.body || '{}');

  const pacotes = {
    starter:  { biscoitos: 10,  valor: 4.90,  descricao: 'Mensagem do Universo — Starter (10 biscoitos)'  },
    mensal:   { biscoitos: 30,  valor: 12.90, descricao: 'Mensagem do Universo — Mensal (30 biscoitos)'   },
    familia:  { biscoitos: 100, valor: 34.90, descricao: 'Mensagem do Universo — Família (100 biscoitos)' }
  };

  const pacoteInfo = pacotes[pacote];
  if (!pacoteInfo) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Pacote inválido' }) };
  }

  try {
    const response = await fetch('https://ws.pagseguro.uol.com.br/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        email: process.env.PAGBANK_EMAIL,
        token: process.env.PAGBANK_TOKEN,
        currency: 'BRL',
        itemId1: '1',
        itemDescription1: pacoteInfo.descricao,
        itemAmount1: pacoteInfo.valor.toFixed(2),
        itemQuantity1: '1',
        reference: `biscoito_${pacote}_${Date.now()}`,
        senderEmail: email || '',
        paymentMethodGroup: 'PIX',
        'extraAmount': '0.00'
      }).toString()
    });

    const text = await response.text();

    // PagBank retorna XML — extraímos o código
    const codigoMatch = text.match(/<code>(.*?)<\/code>/);
    if (!codigoMatch) {
      throw new Error('Resposta inesperada do PagBank: ' + text);
    }

    const codigo = codigoMatch[1];
    const urlPagamento = `https://pagseguro.uol.com.br/v2/checkout/payment.html?code=${codigo}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        codigo,
        urlPagamento,
        pacote: pacoteInfo
      })
    };

  } catch (err) {
    console.error('Erro PagBank:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Erro ao gerar pagamento. Tente novamente.' })
    };
  }
};
