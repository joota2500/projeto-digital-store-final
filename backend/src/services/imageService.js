const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { criarErro } = require('../middleware/errorHandler');

const pastaUploads = path.resolve(__dirname, '../../uploads');

const extensoes = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

// Garante que a pasta uploads existe antes de gravar um arquivo
function garantirPasta() {
  if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
  }
}

// Descobre se o conteúdo é uma URL pronta ou um base64 de imagem
function ehUrl(conteudo) {
  return typeof conteudo === 'string' && /^https?:\/\//i.test(conteudo);
}

function ehCaminhoLocal(conteudo) {
  return typeof conteudo === 'string' && conteudo.startsWith('/') && !conteudo.startsWith('/9j') && !ehUrl(conteudo);
}

// Salva uma imagem em base64 na pasta uploads e devolve o caminho público
function salvarBase64(tipo, conteudo) {
  if (!conteudo || typeof conteudo !== 'string') {
    throw criarErro(400, 'Conteúdo da imagem é obrigatório');
  }

  let mime = tipo;
  let base64 = conteudo.trim();

  // Aceita tanto o base64 puro quanto o formato data:image/png;base64,...
  const dataUrl = conteudo.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (dataUrl) {
    mime = dataUrl[1];
    base64 = dataUrl[2];
  }

  const extensao = extensoes[mime];
  if (!extensao) {
    throw criarErro(400, 'Tipo de imagem não suportado');
  }

  garantirPasta();

  const nome = `${crypto.randomUUID()}${extensao}`;
  const caminhoArquivo = path.join(pastaUploads, nome);

  try {
    fs.writeFileSync(caminhoArquivo, Buffer.from(base64, 'base64'));
  } catch (err) {
    throw criarErro(400, 'Não foi possível salvar a imagem');
  }

  return `/uploads/${nome}`;
}

// Monta a URL completa para o front conseguir exibir a imagem
function montarUrlImagem(req, caminho) {
  if (!caminho) return caminho;
  if (ehUrl(caminho)) return caminho;

  const base = `${req.protocol}://${req.get('host')}`;
  if (caminho.startsWith('/')) {
    return `${base}${caminho}`;
  }
  return `${base}/uploads/${caminho}`;
}

// Apaga o arquivo do disco se ele estiver na pasta uploads
function apagarArquivo(caminho) {
  if (!caminho) return;

  let nome = caminho;
  if (caminho.startsWith('/uploads/')) {
    nome = caminho.replace('/uploads/', '');
  } else if (caminho.startsWith('uploads/')) {
    nome = caminho.replace('uploads/', '');
  } else if (caminho.startsWith('/media/')) {
    // Imagens originais do front não devem ser apagadas
    return;
  } else if (caminho.includes('/')) {
    return;
  }

  const arquivo = path.join(pastaUploads, nome);
  if (fs.existsSync(arquivo)) {
    fs.unlinkSync(arquivo);
  }
}

module.exports = {
  salvarBase64,
  montarUrlImagem,
  apagarArquivo,
  ehUrl,
  ehCaminhoLocal,
};
