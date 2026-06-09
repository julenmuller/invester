
# Metodologia

A metodologia de trabalho escolhida para o desenvolvimento do projeto foi baseada no **Kanban**, priorizando a visualização das tarefas, a manutenção de um fluxo contínuo de trabalho e a entrega incremental de valor.  

Foram definidos os ambientes de trabalho e ferramentas de apoio para garantir organização, versionamento do código e rastreabilidade das atividades. Essa estrutura possibilita transparência, controle do andamento e evolução incremental da aplicação.

## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), sendo que o [Github](https://github.com)
foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já validada e pronta para entrega
- `develop`: versão de desenvolvimento em andamento
- `feature/`: ramificações destinadas à implementação de novas funcionalidades
- `hotfix/`: correções emergenciais realizadas na versão estável

As mensagens de **commit** seguem a convenção de *Conventional Commits*, com prefixos que indicam a natureza da alteração:

- `feat:`: introdução de uma nova funcionalidade
- `fix:`: correção de um problema
- `ci:`: ajustes na integração contínua (GitHub Actions)
- `docs:`: alterações na documentação
- `test:`: inclusão ou ajuste de testes
- `refactor:`: refatoração sem mudança de comportamento

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

A configuração do projeto no GitHub foi organizada de forma a permitir rastreabilidade e integração entre issues, commits e pull requests. Os **commits** seguem mensagens padronizadas e os **merges** são realizados por meio de pull requests. As **tags** são utilizadas para marcar versões estáveis. A cada push, a esteira de **CI no GitHub Actions** executa lint e testes automatizados, garantindo a integridade do código integrado.

## Gerenciamento de Projeto

### Divisão de Papéis

O InvestHub é desenvolvido como um **projeto individual**, no qual a desenvolvedora acumula os papéis típicos de um time ágil:

- Product Owner: Juliana Gimenes
- Kanban Leader: Juliana Gimenes
- Dev Team (Time de Desenvolvimento): Juliana Gimenes

## Ferramentas

As ferramentas empregadas no projeto são:

- **Editor de código (VS Code)**: integração com Git e suporte a extensões.  
- **GitHub Actions**: integração contínua (lint e testes automatizados a cada push).  
- **Docker/Docker Compose**: orquestração dos serviços de apoio (PostgreSQL e Redis).  
- **Ferramenta de desenho de tela (Figma)**: para wireframes e prototipação.  
- **GitHub Projects**: gerenciamento de tarefas em Kanban.  

A escolha dessas ferramentas se deu pela facilidade de integração, promovendo organização, automação e rastreabilidade.
