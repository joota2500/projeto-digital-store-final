#!/bin/bash
# Script para rodar o back-end e o front-end juntos com um comando só
# Uso: ./iniciar.sh

# entra na pasta do projeto (onde este arquivo está)
cd "$(dirname "$0")"

# instala as dependências se ainda não tiver
[ -d node_modules ] || npm install
[ -d backend/node_modules ] || npm install --prefix backend

# sobe a API (porta 3001) e o site (porta 5173) ao mesmo tempo
npm run start:all
