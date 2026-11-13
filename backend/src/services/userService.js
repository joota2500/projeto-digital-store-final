const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { criarErro } = require('../middleware/errorHandler');
const { lerId, emailValido } = require('./helpers');

// Monta o objeto de resposta sem a senha
function formatarUsuario(user) {
  return {
    id: user.id,
    firstname: user.firstname,
    surname: user.surname,
    email: user.email,
  };
}

async function buscarPorId(idParam) {
  const id = lerId(idParam);
  const user = await User.findByPk(id);
  if (!user) {
    throw criarErro(404, 'Usuário não encontrado');
  }
  return formatarUsuario(user);
}

async function criar(dados) {
  const { firstname, surname, email, password, confirmPassword } = dados || {};

  if (!firstname || !surname || !email || !password || !confirmPassword) {
    throw criarErro(400, 'Preencha firstname, surname, email, password e confirmPassword');
  }

  if (!emailValido(email)) {
    throw criarErro(400, 'E-mail inválido');
  }

  if (password !== confirmPassword) {
    throw criarErro(400, 'A confirmação da senha não confere');
  }

  const jaExiste = await User.findOne({ where: { email } });
  if (jaExiste) {
    throw criarErro(400, 'E-mail já cadastrado');
  }

  const senhaHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstname,
    surname,
    email,
    password: senhaHash,
  });

  return formatarUsuario(user);
}

async function atualizar(idParam, dados) {
  const id = lerId(idParam);
  const user = await User.findByPk(id);
  if (!user) {
    throw criarErro(404, 'Usuário não encontrado');
  }

  const { firstname, surname, email, password, confirmPassword } = dados || {};

  if (
    firstname === undefined &&
    surname === undefined &&
    email === undefined &&
    password === undefined
  ) {
    throw criarErro(400, 'Envie ao menos um campo para atualizar');
  }

  if (email !== undefined) {
    if (!emailValido(email)) {
      throw criarErro(400, 'E-mail inválido');
    }
    const outro = await User.findOne({ where: { email } });
    if (outro && outro.id !== id) {
      throw criarErro(400, 'E-mail já cadastrado');
    }
    user.email = email;
  }

  if (firstname !== undefined) user.firstname = firstname;
  if (surname !== undefined) user.surname = surname;

  if (password !== undefined) {
    if (password !== confirmPassword) {
      throw criarErro(400, 'A confirmação da senha não confere');
    }
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
}

async function remover(idParam) {
  const id = lerId(idParam);
  const user = await User.findByPk(id);
  if (!user) {
    throw criarErro(404, 'Usuário não encontrado');
  }
  await user.destroy();
}

async function gerarToken(dados) {
  const { email, password } = dados || {};

  if (!email || !password) {
    throw criarErro(400, 'E-mail e senha são obrigatórios');
  }

  const user = await User.findOne({ where: { email } });
  const senhaOk = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !senhaOk) {
    throw criarErro(400, 'E-mail ou senha incorretos');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token };
}

module.exports = {
  buscarPorId,
  criar,
  atualizar,
  remover,
  gerarToken,
};
