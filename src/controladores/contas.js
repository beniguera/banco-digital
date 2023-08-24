let { contas, saques, transferencias, depositos } = require('../bancodedados')
let proximoIdConta = 1;
const { contaExistente } = require('../utils/funcoes')

const listarContas = (req, res) => {
    return res.status(200).json(contas)
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = {
        id: proximoIdConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    proximoIdConta++;

    contas.push(conta);
    return res.status(201).json(conta)
}

const atualizarUsuarioConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = contaExistente(numeroConta);

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;

    return res.status(200).json(conta)
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contaExistente(numeroConta);

    if (Number(conta.saldo) !== 0) {
        return res.status(400).json({ "mensagem": "O saldo precisa estar zerado." })
    }

    contas = contas.filter((conta) => {
        return Number(conta.id) !== Number(numeroConta);
    })
    return res.status(200).json({ "mensagem": "Conta excluída com sucesso!" })
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const conta = contaExistente(numero_conta);

    return res.status(200).json({ saldo: Number(`${conta.saldo}`) })

}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    const conta = contaExistente(numero_conta);

    const listaSaques = saques.filter((saque) => {
        return saque.conta == conta.id
    })

    const listaDepositos = depositos.filter((deposito) => {
        return deposito.conta == conta.id
    })

    const listaTransferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.conta_de_origem == conta.id
    })

    const listaTransferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.conta_de_destino == conta.id
    })

    const extrato = {
        saques: listaSaques,
        depositos: listaDepositos,
        transferencias_enviadas: listaTransferenciasEnviadas,
        transferencias_recebidas: listaTransferenciasRecebidas
    }
    return res.status(200).json(extrato)
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    saldo,
    extrato
}