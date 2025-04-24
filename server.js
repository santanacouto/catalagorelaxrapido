const express = require('express');
const axios = require('axios');
const qs = require('qs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let cacheProdutos = null;
let ultimoCache = 0;
const CACHE_TEMPO_MS = 5 * 60 * 1000;

app.get('/produtos', async (req, res) => {
  const agora = Date.now();

  if (cacheProdutos && agora - ultimoCache < CACHE_TEMPO_MS) {
    return res.send(cacheProdutos);
  }

  const dados = {
    StoreName: 'Relax',
    StoreID: '59589',
    Username: 'Bling',
    Password: '@852123Bling',
    method: 'ReportView',
    ObjectID: '425',
    OutputFormat: '6'
  };

  try {
    const resposta = await axios.post('https://www.rumo.com.br/sistema/adm/APILogon.asp', qs.stringify(dados), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    cacheProdutos = resposta.data;
    ultimoCache = agora;

    res.send(resposta.data);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err.message);
    res.status(500).send('Erro na API');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

