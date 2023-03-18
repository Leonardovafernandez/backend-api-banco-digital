const bancoDeDados = require('../banco de dados/banco digital');

let idDaConta = 001;

const listarConta = (req, res) => {
    try {
        const { senha_banco } = req.query;

        if (!senha_banco) {
            return res.status(404).json({ mensagem: 'É preciso informar a senha do banco!' });
        };

        if (senha_banco !== 'Cubos123Bank') {
            return res.status(404).json({ mensagem: 'A senha do banco informada é inválida!' });
        };
        return res.status(200).json(bancoDeDados.contas)
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    };
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json({ mensagen: 'O nome deve ser informado.' })
    }

    const checagemDoCpf = bancoDeDados.contas.find(conta => conta.usuario.cpf === cpf);

    if (checagemDoCpf) {
        return res.status(403).json({ mensagen: 'O CPF informado já consta no banco de dados.' })
    }

    if (!cpf) {
        return res.status(404).json({ mensagen: 'O CPF deve ser informado.' })
    }

    if (cpf.length !== 11) {
        console.log(cpf.length);
        return res.status(400).json({ mensagen: 'No campo de CPF deve conter apenas numeros, sem caracteres especiais. Dessa forma, o CPF deve conter no total 11 digitos.' })
    }

    if (!data_nascimento) {
        return res.status(404).json({ mensagen: 'A data de nascimento deve ser informada.' }) // checar se é maior de 18 anos.
    }

    if (!telefone) {
        return res.status(404).json({ mensagen: 'O telefone deve ser informado.' })
    }

    const checagemDoEmail = bancoDeDados.contas.find(conta => conta.usuario.email === email);

    if (checagemDoEmail) {
        return res.status(403).json({ mensagen: 'O email informado já consta no banco de dados.' })
    }

    if (!email) {
        return res.status(404).json({ mensagen: 'O email deve ser informado.' })
    }

    if (!senha) {
        return res.status(404).json({ mensagen: 'A senha deve ser informada.' })
    }

    try {
        const novoUsuario = {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }

        const novaConta = {
            numero: idDaConta,
            saldo: 0,
            usuario: novoUsuario
        }

        bancoDeDados.contas.push(novaConta);

        idDaConta++;

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const atualizarConta = (req, res) => {
    const numeroDaConta = Number(req.params.numeroConta)

    if (isNaN(numeroDaConta)) {
        return res.status(400).json({ mensagen: 'O id informmado não é um número válido.' })
    }

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json({ mensagen: 'O nome deve ser informado.' })
    }

    if (!cpf) {
        return res.status(404).json({ mensagen: 'O CPF deve ser informado.' })
    }

    if (cpf.length !== 11) {
        console.log(cpf.length);
        return res.status(400).json({ mensagen: 'No campo de CPF deve conter apenas numeros, sem caracteres especiais. Dessa forma, o CPF deve conter no total 11 digitos.' })
    }

    if (!data_nascimento) {
        return res.status(404).json({ mensagen: 'A data de nascimento deve ser informada.' }) // checar se é maior de 18 anos.
    }

    if (!telefone) {
        return res.status(404).json({ mensagen: 'O telefone deve ser informado.' })
    }

    if (!email) {
        return res.status(404).json({ mensagen: 'O email deve ser informado.' })
    }

    if (!senha) {
        return res.status(404).json({ mensagen: 'A senha deve ser informada.' })
    }


    try {

        const indiceConta = bancoDeDados.contas.findIndex(conta => conta.numero === numeroDaConta);

        if (indiceConta < 0) {
            return res.status(404).json({ mensagen: 'Conta não encontrada.' })
        }

        const checagemDoCpf = bancoDeDados.contas.find(conta => conta.usuario.cpf === cpf);

        if (checagemDoCpf) {
            if (bancoDeDados.contas[indiceConta].usuario.cpf !== cpf) {
                return res.status(403).json({ mensagen: 'O CPF informado já consta no banco de dados.' });
            };
        }


        const checagemDoEmail = bancoDeDados.contas.find(conta => conta.usuario.email === email);

        if (checagemDoEmail) {
            if (bancoDeDados.contas[indiceConta].usuario.email !== email) {
                return res.status(403).json({ mensagen: 'O email informado já consta no banco de dados.' });
            };
        }

        const novoUsuario = {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        };

        bancoDeDados.contas[indiceConta].usuario = novoUsuario;

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const excluirConta = (req, res) => {
    const numeroDaConta = Number(req.params.numeroConta)

    if (isNaN(numeroDaConta)) {
        return res.status(400).json({ mensagen: 'O id informmado não é um número válido.' })
    }
    try {
        const indiceContaExclusão = bancoDeDados.contas.findIndex(conta => conta.numero === numeroDaConta);

        if (indiceContaExclusão < 0) {
            return res.status(404).json({ mensagen: 'Conta não encontrada.' })
        }
        if (bancoDeDados.contas[indiceContaExclusão].saldo !== 0) {
            return res.status(403).json({ mensagen: 'A conta só pode ser removida se o saldo for zero!' })
        }

        const contaExcluida = bancoDeDados.contas.splice(indiceContaExclusão, 1);


        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagen: 'O número da conta e o valor são obrigatórios!' })
    }

    const indice = bancoDeDados.contas.findIndex(conta => conta.numero === Number(numero_conta));

    if (indice < 0) {
        return res.status(404).json({ mensagen: 'Conta não encontrada.' })
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagen: 'Não é possível realizar depósitos de valores zerados ou negativos.' })
    }

    try {
        bancoDeDados.contas[indice].saldo += valor;
        const momento = new Date();
        const data = `${momento.getFullYear()}-${momento.getMonth()}-${momento.getDay()} ${momento.getHours()}:${momento.getMinutes()}:${momento.getSeconds()}`;

        const recibo = {
            data,
            numero_conta,
            valor
        }

        bancoDeDados.depositos.push(recibo);

        return res.status(200).send();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(404).json({ mensagen: 'O número da conta, o valor e a senha são obrigatórios!' })
    }

    const indice = bancoDeDados.contas.findIndex(conta => conta.numero === Number(numero_conta));

    if (indice < 0) {
        return res.status(404).json({ mensagen: 'Conta não encontrada.' })
    }

    if (bancoDeDados.contas[indice].usuario.senha !== senha) {
        return res.status(404).json({ mensagen: 'Senha inválida' })
    }

    if (valor <= 0) {
        return res.status(403).json({ mensagen: 'Não é possível realizar saques de valores zerados ou negativos.' })
    }

    try {
        if (bancoDeDados.contas[indice].saldo < valor) {
            return res.status(403).json({ mensagen: 'Saldo insuficiente.' })
        }

        bancoDeDados.contas[indice].saldo -= valor;
        const momento = new Date();
        const data = `${momento.getFullYear()}-${momento.getMonth()}-${momento.getDay()} ${momento.getHours()}:${momento.getMinutes()}:${momento.getSeconds()}`;

        const recibo = {
            data,
            numero_conta,
            valor
        }

        bancoDeDados.saques.push(recibo);

        return res.status(200).send();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(404).json({ mensagen: 'O número da conta, o valor e a senha são obrigatórios!' })
    }

    const indiceContaOrigem = bancoDeDados.contas.findIndex(conta => conta.numero === Number(numero_conta_origem));

    const indiceContaDestino = bancoDeDados.contas.findIndex(conta => conta.numero === Number(numero_conta_destino));

    if (indiceContaOrigem < 0) {
        return res.status(404).json({ mensagen: 'Conta de origem não encontrada.' })
    }

    if (indiceContaDestino < 0) {
        return res.status(404).json({ mensagen: 'Conta de destino não encontrada.' })
    }

    if (bancoDeDados.contas[indiceContaOrigem].usuario.senha !== senha) {
        return res.status(404).json({ mensagen: 'Senha inválida' })
    }

    if (valor <= 0) {
        return res.status(403).json({ mensagen: 'Não é possível realizar saques de valores zerados ou negativos.' })
    }

    try {
        if (bancoDeDados.contas[indiceContaOrigem].saldo < valor) {
            return res.status(403).json({ mensagen: 'Saldo insuficiente.' })
        }

        bancoDeDados.contas[indiceContaOrigem].saldo -= valor;
        bancoDeDados.contas[indiceContaDestino].saldo += valor;

        const momento = new Date();
        const data = `${momento.getFullYear()}-${momento.getMonth()}-${momento.getDay()} ${momento.getHours()}:${momento.getMinutes()}:${momento.getSeconds()}`;

        const recibo = {
            data,
            numero_conta_origem,
            numero_conta_destino,
            valor
        }

        bancoDeDados.transferencias.push(recibo);

        return res.status(200).send();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const emitirSaldo = (req, res) => {
    try {
        const { numero_conta, senha } = req.query;

        if (!numero_conta) {
            return res.status(404).json({ mensagem: 'É preciso informar o número da conta!' });
        };

        if (!senha) {
            return res.status(404).json({ mensagem: 'É preciso informar sua senha!' });
        };

        const indice = bancoDeDados.contas.findIndex(conta => conta.numero === Number(numero_conta));

        if (indice < 0) {
            return res.status(404).json({ mensagen: 'Conta não encontrada.' })
        }

        if (senha !== bancoDeDados.contas[indice].usuario.senha) {
            return res.status(404).json({ mensagem: 'A senha do banco informada é inválida!' });
        };

        const saldo = {
            saldo: bancoDeDados.contas[indice].saldo
        }

        return res.json(saldo);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const emitirExtrato = (req, res) => {
    try {
        const { numero_conta, senha } = req.query;

        if (!numero_conta) {
            return res.status(404).json({ mensagem: 'É preciso informar o número da conta!' });
        };

        if (!senha) {
            return res.status(404).json({ mensagem: 'É preciso informar sua senha!' });
        };

        const indice = bancoDeDados.contas.findIndex(conta => conta.numero === Number(numero_conta));

        if (indice < 0) {
            return res.status(404).json({ mensagen: 'Conta não encontrada.' })
        }

        if (senha !== bancoDeDados.contas[indice].usuario.senha) {
            return res.status(404).json({ mensagem: 'A senha do banco informada é inválida!' });
        };

        const depositos = [];

        bancoDeDados.depositos.forEach((deposito) => {
            if (numero_conta === deposito.numero_conta) {
                depositos.push(deposito);
            };
        })


        const saques = [];

        bancoDeDados.saques.forEach((saque) => {
            if (numero_conta === saque.numero_conta) {
                saques.push(saque);
            };
        })

        const transferenciasEnviadas = [];

        bancoDeDados.transferencias.forEach((transferencia) => {
            if (numero_conta === transferencia.numero_conta_origem) {
                transferenciasEnviadas.push(transferencia);
            };
        })

        const transferenciasRecebidas = [];

        bancoDeDados.transferencias.forEach((transferencia) => {
            if (numero_conta === transferencia.numero_conta_destino) {
                transferenciasRecebidas.push(transferencia);
            };
        })

        const extrato = {
            depositos,
            saques,
            transferenciasEnviadas,
            transferenciasRecebidas
        }

        return res.json(extrato);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = {
    listarConta,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    emitirSaldo,
    emitirExtrato
};