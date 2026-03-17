# nutspoker

Este projeto consiste em um site com funcionalidades para jogar o jogo de cartas "Poker", com um timer e um sistema de tabelas para cadastro dos jogadores

---

## 🎯 Sobre o Projeto

Sistema com funcionalidades para jogar o jogo "Poker"
- ✅ Timer totalmente alterável 
- ✅ Controle de blinds totalmente alterável
- ✅ Sistema de cadastro de participantes semi-automática
- ✅ Sistema de campeão

---

## 🧑‍💻 Tecnologias Utilizadas

### Backend (Desenvolvido 100% por mim)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![UUID](https://img.shields.io/badge/UUID-black?style=for-the-badge&logoColor=white)

### Frontend (Com auxílio de IA)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Ferramentas de Desenvolvimento
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## 🔐 Funcionalidades de Segurança  
- ✅ Controle de sessão com UUID (armazenado no banco de dados e local storage)  
- ✅ Validação de UUID em endpoints  

---

## ⚙️ Requisitos

Antes de começar, certifique-se de ter instalado:

- **MySQL 8.0+** - [Download](https://www.mysql.com/downloads/)
- **JDK 21+** - [Download](https://www.oracle.com/java/technologies/javase-jdk21-downloads.html)
- **Node.js (22.16.0) e NPM (10.9.2)** - [Download](https://nodejs.org/)

---

## ✨ Como Rodar o Projeto

### Backend (Kotlin/Spring Boot)

**Clone e configure o banco de dados:**

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/seu_banco?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: seu_usuario
    password: sua_senha
```

### Frontend 

**Instale as dependências e inicie o servidor (na pasta do frontend):**

```
npm install
npm install axios
npm install react-router-dom
npm start
```

---

## 👀 Rodar Localmente

- 🔄️ Backend (porta: 8080)  
- 🔄️ Frontend (porta: 3000)

---

## 😥 Observações

- Deixar apenas um site aberto por máquina, devido ao conflito no banco de dados

---

