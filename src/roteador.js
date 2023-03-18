const express = require('express');
const { listarConta, criarConta, atualizarConta, excluirConta, depositar, sacar, transferir, emitirSaldo, emitirExtrato } = require('./controladores/banco digital');

const rotas = express();

rotas.get('/contas', listarConta);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', emitirSaldo);
rotas.get('/contas/extrato', emitirExtrato);

module.exports = rotas;