const { format } = require('date-fns');
const { contas } = require('../bancodedados');

const date = (novaData) => {
    const data = format(new Date(), "dd-MM-yyyy' 'HH:mm:ss");
    return data;
};

const contaExistente = (id) => {
    return contas.find((conta) => {
        return Number(conta.id) === Number(id)
    })
};

module.exports = {
    date,
    contaExistente
}
