const { banco, contas } = require('../bancodedados')
const { contaExistente } = require('../utils/funcoes')

const verificarSenhaBanco = (req, res, next) => {
    const { senha } = req.query;

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha não foi informada.' });
    }

    if (senha !== banco.senha) {
        return res.status(400).json({ mensagem: 'A senha está incorreta.' });
    }

    next();
}

const verificarCamposObrigatorios = (req, res, next) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' })
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O campo cpf é obrigatório.' })
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'O campo data de nascimento é obrigatório.' })
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O campo telefone é obrigatório.' })
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O campo e-mail é obrigatório.' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' })
    }
    next();
}

const verificarCpfUnico = (req, res, next) => {
    const { cpf } = req.body;
    const cpfExistente = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    })
    if (cpfExistente) {
        return res.status(400).json({ "mensagem": "O CPF já está em uso." })
    }
    next();
}

const verificarEmailUnico = (req, res, next) => {
    const { email } = req.body;
    const emailExistente = contas.find((conta) => {
        return conta.usuario.email === email
    })
    if (emailExistente) {
        return res.status(400).json({ "mensagem": "O e-mail já está em uso." })
    }
    next();
}

const verificarContaExistente = (req, res, next) => {
    const { numeroConta } = req.params;

    if (!contaExistente(numeroConta)) {
        return res.status(404).json({ "mensagem": "O número da conta informado não existe." })
    }

    next();
}

const verificarContaExistenteTransacao = (req, res, next) => {
    const { numero_conta } = req.body;

    if (!contaExistente(numero_conta)) {
        return res.status(404).json({ "mensagem": "O número da conta informado não existe." })
    }

    next();
}

const verificarContaExistenteConsulta = (req, res, next) => {
    const { numero_conta } = req.query;

    if (!contaExistente(numero_conta)) {
        return res.status(404).json({ "mensagem": "O número da conta informado não existe." })
    }

    next();
}

const verificarSenhaUsuario = (req, res, next) => {
    const { senha, numero_conta } = req.body;

    const conta = contaExistente(numero_conta);

    if (!senha) {
        return res.status(404).json({ mensagem: 'A senha não foi informada.' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(400).json({ mensagem: 'A senha está incorreta.' });
    }

    next();
}

const verificarSenhaConsulta = (req, res, next) => {
    const { senha, numero_conta } = req.query;

    const conta = contaExistente(numero_conta);

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha não foi informada.' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(400).json({ mensagem: 'A senha está incorreta.' });
    }

    next();
}

const verificarSaldoTransacao = (req, res, next) => {
    const { numero_conta, valor } = req.body;

    const conta = contaExistente(numero_conta);

    if (Number(conta.saldo) < Number(valor)) {
        return res.status(400).json({ "mensagem": "Não há saldo para a operação." })
    }
    next();
}

const verificarValor = (req, res, next) => {
    const { valor } = req.body;

    if (Number(valor) <= 0 || !valor) {
        return res.status(400).json({ "mensagem": "Digite um valor válido." })
    }

    next();
}

module.exports = {
    verificarSenhaBanco,
    verificarCamposObrigatorios,
    verificarCpfUnico,
    verificarEmailUnico,
    verificarContaExistente,
    verificarSenhaUsuario,
    verificarContaExistenteTransacao,
    verificarSaldoTransacao,
    verificarValor,
    verificarContaExistenteConsulta,
    verificarSenhaConsulta
}