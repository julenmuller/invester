
# Projeto de Interface

Visão geral da interação do usuário pelas telas do sistema e protótipo interativo das telas com as funcionalidades que fazem parte do sistema (wireframes).

Apresenta as principais interfaces da plataforma. Discute como elas foram elaboradas de forma a atender os requisitos funcionais, não funcionais e histórias de usuário abordados na <a href="02-Especificação do Projeto.md"> Documentação de Especificação</a>.

## Diagrama de Fluxo

<img width="9216" height="7488" alt="Frame 12" src="" />

## Wireframes
<img width="773" height="506" alt="image" src="" />

**Requisitos:**  
RF-002 – Autenticação do usuário (login/logout) com JWT.
  
<img width="347" height="228" alt="image" src="" />

<img width="346" height="225" alt="image" src="" />

**Requisitos:**  
RF-001 – Cadastro de usuário (nome, e-mail, senha).

<img width="345" height="226" alt="image" src="" />
  
**Requisitos:**  
RF-003 – Criar carteira de investimentos.
RF-012 – Autorização por posse (a carteira é associada ao usuário autenticado).

<img width="346" height="225" alt="image" src="" />
 
**Requisitos:**  
RF-004 – Listar as carteiras do usuário (paginado).
RF-010 – Patrimônio consolidado no dashboard.

<img width="345" height="223" alt="image" src="" />
 
**Requisitos:**  
RF-005 – Visualizar o detalhe da carteira (ativos, cotações, lucro/prejuízo, valor total).
RF-009 – Buscar e filtrar ativos dentro da carteira (por código e por tipo).
RF-011 – Integração com cotações reais de mercado (Brapi) com cache.

<img width="344" height="228" alt="image" src="" />

**Requisitos:**  
RF-005 – Visualizar o detalhe da carteira.
RF-010 – Visualizar a alocação por classe de ativo (gráfico).
RF-011 – Cotações reais de mercado por ativo.

<img width="347" height="220" alt="image" src="" />

**Requisitos:**  
RF-006 – Adicionar um ativo à carteira (ticker, tipo, quantidade, preço médio).
RNF-002 – Validação de dados de entrada com Zod.

<img width="345" height="209" alt="image" src="" />
  
**Requisitos:**  
RF-006 – Adicionar um ativo à carteira (validação de quantidade > 0, preço > 0 e ticker em formato correto).

<img width="347" height="207" alt="image" src="" />
  
**Requisitos:**  
RF-007 – Renomear uma carteira (PATCH).

<img width="344" height="223" alt="image" src="" />
  
**Requisitos:**  
RF-008 – Excluir uma carteira (DELETE) com confirmação e remoção em cascata dos ativos.
RF-012 – Autorização por posse (somente o dono pode excluir a carteira).

<img width="344" height="225" alt="image" src="" />
  
**Requisitos:**  
RF-009 – Buscar e filtrar ativos dentro da carteira (por código e por tipo).

<img width="345" height="209" alt="image" src="" />
 
**Requisitos:** 
RF-010 – Alocação por classe de ativo e patrimônio consolidado no dashboard. 
RF-011 – Cotações reais de mercado com cache. 
