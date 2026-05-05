# GeoRisk Monitor

Sistema de alerta de riscos geográficos e climáticos voltado para moradores e gestores da **Zona Leste de São Paulo — Tatuapé**.

---

## Sobre o projeto

O GeoRisk Monitor nasceu de uma necessidade real: a falta de informação rápida e confiável durante chuvas fortes no Tatuapé. O sistema exibe, em tempo real, as condições climáticas da região, calcula um índice de risco (0–100) e permite que moradores registrem alertas colaborativos diretamente no mapa — tudo acessível pelo navegador, sem instalar nada.

---

## Funcionalidades principais

- **Mapa interativo** centralizado no Tatuapé com marcadores coloridos de alerta
- **Índice de risco** calculado automaticamente com base em vento, chuva e código WMO
- **Alertas manuais**: qualquer usuário cadastrado pode clicar no mapa e registrar uma ocorrência (alagamento, chuva forte)
- **Alertas automáticos**: gerados pelo sistema quando os dados climáticos atingem limites críticos
- **Sincronização em tempo real** via Firebase Firestore — sem necessidade de recarregar a página
- **Previsão de 7 dias** no painel lateral
- **Notificações pelo navegador** quando o índice de risco ultrapassa 70
- **Autenticação com JWT** e senhas protegidas por BCrypt

---

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | HTML, CSS e JavaScript puro (arquivos `.html` com CSS e JS embutidos, sem frameworks) |
| Backend | Java 21 + Spring Boot 3.3.5 |
| Banco de dados | MySQL 8 |
| Autenticação | Firebase Authentication + JWT |
| Sincronização | Firebase Firestore |
| Mapa | Leaflet.js + CartoDB Dark Matter |
| Dados climáticos | API Open-Meteo (gratuita, sem cadastro) |

---

## Arquitetura

```
Frontend (HTML/CSS/JS)
    │
    ├── Leaflet.js (mapa interativo)
    ├── Firebase Authentication (login/cadastro)
    ├── Firebase Firestore (alertas em tempo real)
    └── API Open-Meteo (dados climáticos a cada 5 min)
            │
            ▼
Backend (Java + Spring Boot)
    │
    ├── AuthController   → cadastro, login, JWT
    ├── AlertaController → criação, listagem, exclusão de alertas
    └── UsuarioController → perfil do usuário logado
            │
            ▼
MySQL 8 (tabelas: usuarios, alertas, ponto_critico)
```

---

## Área monitorada

Círculo de **1.700 metros de raio** com centro no Tatuapé:
- Latitude: `-23.5405`
- Longitude: `-46.5760`

Alertas registrados fora dessa área são bloqueados automaticamente.

---

## Como executar localmente

### Pré-requisitos

- Java 21+
- MySQL 8
- Navegador moderno (Chrome, Firefox, Edge)

### Backend

1. Crie o banco de dados:
   ```sql
   CREATE DATABASE climas_rotas;
   ```

2. Configure o arquivo `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/climas_rotas?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   spring.jpa.hibernate.ddl-auto=update
   jwt.secret=sua-chave-secreta
   jwt.expiration=86400000
   server.port=8080
   ```

3. Suba o servidor:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend

Abra o arquivo `georisk.html` diretamente no navegador ou sirva os arquivos por qualquer servidor HTTP estático.

---

## Estrutura de páginas

| Arquivo | Descrição |
|---------|-----------|
| `georisk.html` | Página principal com login e cadastro |
| `georisk_mapa.html` | Tela principal do sistema (mapa + painel) |
| `cadastro.html` | Formulário de cadastro alternativo |
| `login.html` | Formulário de login alternativo |

---

## Índice de risco

| Faixa | Nível | Cor |
|-------|-------|-----|
| 0 – 29 | Baixo | Verde |
| 30 – 59 | Moderado | Amarelo |
| 60 – 100 | Alto | Vermelho |

Quando o índice supera **70**, um banner de alerta é exibido e uma notificação pode ser enviada pelo navegador.

---

## Limitações conhecidas

- Funciona apenas no navegador (sem app nativo para Android/iOS)
- Somente em português brasileiro
- Alertas automáticos não são persistidos no banco — somem ao recarregar a página
- Depende do plano gratuito do Firebase (limite diário de leituras/escritas)
- Área monitorada fixa no código-fonte

---

## Equipe

Desenvolvido como projeto acadêmico por:

- Éric da Silva Barros
- Evandro Benati
- Hellen Ariane Bastos de Oliveira
- Isabela Araujo de Santana
- Larissa Santos Ferreira
- Maria Eduarda Lemos Pelegrin Machado
- Pedro Henrique Ferreira Lima
- Zulma Vicente Cespedes

---

## Referências externas

- [Open-Meteo API](https://open-meteo.com/en/docs)
- [Leaflet.js](https://leafletjs.com)
- [Firebase](https://firebase.google.com)
- [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html)

---

*GeoRisk Monitor v3.0 — São Paulo, 2025*
