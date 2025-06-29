# Sistema de Cadastro de Contatos - Challenge

&#x20;   &#x20;

---

## 📖 Descrição

Este projeto é um **sistema de gerenciamento de contatos** que permite aos usuários registrar-se, autenticar-se e realizar operações de CRUD (Create, Read, Update, Delete) em uma lista de contatos. A aplicação utiliza:

- Consulta de endereços pelo CEP via **ViaCep API** ([github.com](https://github.com/Bruno-Biscaia/challenge_uex))
- Exibição de localização no mapa usando **@react-google-maps/api** ([raw.githubusercontent.com](https://raw.githubusercontent.com/Bruno-Biscaia/challenge_uex/main/package.json))
- Armazenamento de dados no **Local Storage**
- Validação de CPF/CNPJ e máscara de campos para melhor UX

---

## 🎯 Funcionalidades

- **Cadastro e Login** (client-side) com armazenamento local seguro
- **CRUD de Contatos** (nome, email, telefone, documento, endereço)
- **Autocompletar endereço** ao digitar CEP (ViaCep API) ([github.com](https://github.com/Bruno-Biscaia/challenge_uex))
- **Mapa interativo** exibindo localização do contato (Google Maps) ([raw.githubusercontent.com](https://raw.githubusercontent.com/Bruno-Biscaia/challenge_uex/main/package.json))
- **Validações** de CPF/CNPJ usando `cpf-cnpj-validator` e máscaras com `react-input-mask` ([raw.githubusercontent.com](https://raw.githubusercontent.com/Bruno-Biscaia/challenge_uex/main/package.json))
- **Rotas e Navegação** com React Router DOM v6
- **Interface** baseada em Material Design V3 via MUI (Material-UI) ([raw.githubusercontent.com](https://raw.githubusercontent.com/Bruno-Biscaia/challenge_uex/main/package.json))

---

## ⚙️ Tecnologias Utilizadas

| Tecnologia                          | Versão  |
| ----------------------------------- | ------- |
| React                               | 18.2.0  |
| @mui/material & @mui/icons-material | 5.15.15 |
| axios                               | 1.6.8   |
| @react-google-maps/api              | 2.19.3  |
| react-router-dom                    | 6.22.3  |
| cpf-cnpj-validator                  | 1.0.3   |
| react-input-mask                    | 2.0.4   |
| uuid                                | 9.0.1   |
| crypto-js                           | 4.2.0   |
| react-scripts                       | 5.0.1   |

> Consulte o `package.json` para detalhes das dependências ([raw.githubusercontent.com](https://raw.githubusercontent.com/Bruno-Biscaia/challenge_uex/main/package.json))

---

## 🚀 Instalação e Execução

1. **Clone** este repositório:
   ```bash
   git clone https://github.com/Bruno-Biscaia/challenge_uex.git
   ```
2. **Instale** as dependências:
   ```bash
   cd challenge_uex
   npm install
   ```
3. **Execute** a aplicação em modo de desenvolvimento:
   ```bash
   npm start
   ```
4. **Acesse** em `http://localhost:3000`

---

## 📂 Estrutura do Projeto

```plaintext
challenge_uex/
├─ public/              # Arquivos estáticos
├─ src/
│  ├─ components/       # Componentes reutilizáveis
│  ├─ pages/            # Páginas e rotas
│  ├─ services/         # Chamadas a APIs (ViaCep, Google Maps)
│  ├─ utils/            # Helpers (validação, formatação)
│  └─ App.js            # Componente raiz
├─ .gitignore
├─ package.json
└─ README.md            # Documentação do projeto
```

---

## ⚙️ Scripts Disponíveis

No diretório do projeto, execute:

| Script          | Descrição                               |
| --------------- | --------------------------------------- |
| `npm start`     | Inicia o servidor de desenvolvimento    |
| `npm run build` | Cria versão otimizada para produção     |
| `npm test`      | Executa testes unitários                |
| `npm run eject` | Eject configurações do Create React App |

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork este repositório.
2. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`.
3. Commit suas alterações: `git commit -m 'Adiciona nova feature'`.
4. Faça push para a branch: `git push origin feature/nome-da-feature`.
5. Abra um Pull Request.

---

## 📜 Licença

Este projeto está licenciado sob a Licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ✒️ Autor

**Bruno Biscaia** – [Perfil no GitHub](https://github.com/Bruno-Biscaia)

Agradecimentos à equipe da UEX Tecnologia pelo desafio!

