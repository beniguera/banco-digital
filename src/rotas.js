const express = require('express');

const { listarContas, criarConta, atualizarUsuarioConta, excluirConta, saldo, extrato } = require('./controladores/contas');
const { depositar, sacar, transferir } = require('./controladores/transacoes');
const { verificarSenhaBanco, verificarContaExistente, verificarCamposObrigatorios, verificarContaExistenteTransacao, verificarCpfUnico, verificarEmailUnico, verificarSenhaUsuario, verificarSaldoTransacao, verificarValor, verificarContaExistenteConsulta, verificarSenhaConsulta } = require('./intermediarios/intermediarios')

const rotas = express();

rotas.get('/contas', verificarSenhaBanco, listarContas);
rotas.post('/contas', verificarCamposObrigatorios, verificarCpfUnico, verificarEmailUnico, criarConta);
rotas.put('/contas/:numeroConta/usuario', verificarContaExistente, verificarCpfUnico, verificarEmailUnico, verificarCamposObrigatorios, atualizarUsuarioConta);
rotas.delete('/contas/:numeroConta', verificarContaExistente, excluirConta);
rotas.post('/transacoes/depositar', verificarContaExistenteTransacao, verificarValor, depositar);
rotas.post('/transacoes/sacar', verificarContaExistenteTransacao, verificarValor, verificarSenhaUsuario, verificarSaldoTransacao, sacar);
rotas.post('/transacoes/transferir', verificarValor, transferir);
rotas.get('/contas/saldo', verificarContaExistenteConsulta, verificarSenhaConsulta, saldo);
rotas.get('/contas/extrato', verificarContaExistenteConsulta, verificarSenhaConsulta, extrato);

module.exports = rotas
