const { saques, depositos, transferencias } = require('../bancodedados')
const { date, contaExistente } = require('../utils/funcoes')

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const conta = contaExistente(numero_conta);

    conta.saldo = Number(conta.saldo) + Number(valor);

    const deposito = {
        data: date(),
        conta: String(numero_conta),
        valor
    }

    depositos.push(deposito);
    return res.status(201).json({ "mensagem": "Depósito realizado com sucesso!" })
}

const sacar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const conta = contaExistente(numero_conta);

    conta.saldo = Number(conta.saldo) - Number(valor);

    const saque = {
        data: date(),
        conta: String(numero_conta),
        valor
    }

    saques.push(saque);
    return res.status(201).json({ "mensagem": "Saque realizado com sucesso!" })
}

const transferir = (req, res) => {
    const { numero_conta_destino, numero_conta_origem, valor, senha } = req.body;

    const conta = contaExistente(numero_conta_origem);

    if (!senha) {
        return res.status(404).json({ mensagem: 'A senha não foi informada.' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(400).json({ mensagem: 'A senha está incorreta.' });
    }

    if (Number(conta.saldo) < Number(valor)) {
        return res.status(400).json({ "mensagem": "Não há saldo para a operação." })
    }

    const contaOrigem = contaExistente(numero_conta_origem);

    const contaDestino = contaExistente(numero_conta_destino);

    if (!contaOrigem) {
        return res.status(404).json({ "mensagem": "O número da conta de origem informada não existe." })
    }

    if (!contaDestino) {
        return res.status(404).json({ "mensagem": "O número da conta de destino informada não existe." })
    }

    contaOrigem.saldo = Number(contaOrigem.saldo) - Number(valor);
    contaDestino.saldo = Number(contaDestino.saldo) + Number(valor);

    const transferencia = {
        data: date(),
        conta_de_origem: String(numero_conta_origem),
        conta_de_destino: String(numero_conta_destino),
        valor
    }

    transferencias.push(transferencia);
    return res.status(201).json({ "mensagem": "Transferência realizada com sucesso!" })
}

module.exports = {
    depositar,
    sacar,
    transferir,
}