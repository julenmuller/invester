# Template Padrão da Aplicação

Layout padrão da aplicação, construído com **Tailwind CSS** e componentes **shadcn/ui**, utilizado em todas as páginas com a definição de identidade visual, aspectos de responsividade e iconografia. A aplicação adota um **tema escuro de estética fintech (moderna e futurista)** e apresenta como elementos padrão o menu de navegação, cabeçalho, rodapé e os elementos visuais citados abaixo:

### Identidade visual (elementos visuais)

#### Cores:

  * **Primárias**: HEX #0B0F1A, #00E5A0; #FFFFFF;
  * **Secundárias**: HEX #1E293B, #38BDF8;
  * **background**: HEX #0F172A, #111827; #1E293B; #00E5A0;
  * **Branco**: HEX #FFFFFF.

#### Família de fontes (font-family): Inter

## Interface da aplicação

### Tela inicial (dashboard)
Exibe a tela inicial da aplicação, composta por cabeçalho com logo, navegação e botão entrar/criar conta. Para o usuário autenticado, apresenta o patrimônio consolidado, a alocação por classe de ativo e o resumo das carteiras.
<div align="center">
 <img width="547" height="330" alt="image" src="" />
 <figcaption>Figura 1 - Tela inicial</figcaption>
</div>

### Tela de Carteiras
Exibe uma tela com o Header e a lista paginada das carteiras do usuário, mostrando para cada carteira o nome e o valor total consolidado.
<div align="center">
 <img width="734" height="438" alt="image" src="" />
</div>

### Tela de detalhar Carteira
Exibe uma tela para visualizar o detalhe de uma carteira, com a lista de ativos, cotações atuais, lucro/prejuízo e valor total, permitindo buscar e filtrar os ativos.
<div align="center">
 <img width="834" height="502" alt="image" src="" />
</div>

### Tela de Alocação por Classe de Ativo
Exibe um gráfico com a alocação do patrimônio entre as classes de ativo (ações, FIIs e renda fixa) e o desempenho consolidado da carteira.
<div align="center">
 <img width="900" height="541" alt="image" src="" />
</div>

### Modal de adicionar ativo
Abre um popup para adicionar/salvar um ativo na carteira (ticker, tipo, quantidade e preço médio), com validação dos campos.
<div align="center">
 <img width="570" height="346" alt="image" src="" />
</div>

### Modal de renomear/excluir carteira
Abre um popup para renomear a carteira ou confirmar sua exclusão, com remoção em cascata dos ativos.
<div align="center">
 <img width="776" height="465" alt="image" src="" />

</div>
