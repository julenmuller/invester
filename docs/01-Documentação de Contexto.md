# Introdução

O projeto “InvestHub” propõe o desenvolvimento de uma aplicação web full-stack de gestão de carteira de investimentos voltada a Assessores de Investimentos (AAIs) e investidores pessoa física. A solução permite cadastrar carteiras, adicionar ativos de diferentes classes (ações, fundos imobiliários e renda fixa) e acompanhar, em um único lugar, cotações reais de mercado, lucro/prejuízo, valor total e a alocação por classe de ativo. O InvestHub busca centralizar e dar transparência à gestão patrimonial, substituindo planilhas manuais e fontes de cotação dispersas por uma visão consolidada, atualizada e visual do patrimônio do investidor.

## Problema
Assessores de Investimentos e investidores pessoa física têm dificuldade de acompanhar, de forma centralizada e em tempo real, a composição e o desempenho de carteiras que reúnem ativos de diferentes classes — ações, fundos imobiliários (FIIs) e renda fixa. As cotações ficam espalhadas em fontes diversas, o cálculo de lucro/prejuízo costuma ser feito manualmente em planilhas e é propenso a erro, e não existe uma visão consolidada do patrimônio. Esse cenário gera retrabalho para o profissional, decisões baseadas em dados desatualizados e baixa transparência para o cliente final. Evidencia-se, portanto, uma lacuna entre o volume de informação de mercado disponível e a capacidade de transformá-la, de modo confiável e automático, em uma visão útil para a tomada de decisão.

## Objetivos

Desenvolver uma aplicação web full-stack que centralize a gestão de carteiras de investimento, integrando cotações reais de mercado, calculando automaticamente o desempenho de cada ativo e oferecendo uma visão consolidada e visual do patrimônio do investidor. Como objetivos específicos, destacam-se: permitir o cadastro e a autenticação de usuários; possibilitar a criação, listagem, renomeação e exclusão de carteiras; permitir adicionar ativos a uma carteira com validação de dados; integrar cotações reais via API de mercado com cache; calcular automaticamente lucro/prejuízo e valor total; e apresentar a alocação por classe de ativo e o patrimônio consolidado em um dashboard.

## Justificativa

A gestão de investimentos exige acompanhamento contínuo de preços que variam ao longo do dia e de carteiras que misturam ativos de naturezas distintas. Quando esse acompanhamento é feito manualmente, o profissional gasta tempo consolidando dados, fica sujeito a erros de cálculo e oferece ao cliente uma fotografia desatualizada do patrimônio.

A relevância desta proposta encontra-se na intersecção entre eficiência operacional, qualidade da informação e transparência para o investidor. Para o Assessor de Investimentos, a solução reduz o retrabalho de consolidar dados de múltiplos clientes e permite decisões embasadas em cotações atualizadas. Para o investidor pessoa física, oferece autonomia e clareza para acompanhar a própria carteira sem depender de planilhas complexas.

Nesse sentido, a aplicação web apresenta-se como uma alternativa viável para transformar um processo manual e propenso a erro em um fluxo automatizado, confiável e visual. Ao integrar cotações reais de mercado, automatizar o cálculo de desempenho e consolidar o patrimônio em uma única interface, o InvestHub contribui para decisões mais informadas e para uma relação mais transparente entre o assessor e o cliente final.

## Público-Alvo

A aplicação proposta será utilizada principalmente por dois perfis distintos de usuários: Assessores de Investimentos (AAIs) e Investidores pessoa física. Embora ambos compartilhem o interesse pelo acompanhamento de carteiras, cada grupo possui características particulares no que se refere ao conhecimento prévio, à relação com a tecnologia e às necessidades específicas.

* Assessores de Investimentos (AAIs)

Os Assessores de Investimentos são profissionais que gerenciam carteiras de múltiplos clientes e precisam de uma visão organizada, consolidada e atualizada do patrimônio sob sua responsabilidade. Possuem alta familiaridade com tecnologia e com o mercado financeiro, dominam os conceitos de classes de ativos, cotação, preço médio e rentabilidade, e atuam de forma profissional, muitas vezes vinculados a escritórios de assessoria credenciados. Para esse público, a plataforma precisa oferecer agilidade na criação e manutenção de carteiras, confiabilidade nos dados de cotação e uma visão consolidada que apoie a comunicação com o cliente.

* Investidores pessoa física

Os investidores pessoa física são pessoas que desejam acompanhar a própria carteira de forma centralizada. Variam bastante em familiaridade tecnológica e em conhecimento sobre o mercado financeiro, o que exige uma interface clara e intuitiva. Dividem-se, em geral, em dois perfis principais:

Investidores iniciantes: estão começando a investir, possuem poucos ativos e ainda estão se familiarizando com conceitos como preço médio e rentabilidade. Buscam uma ferramenta simples, que os ajude a entender de forma visual quanto têm investido e como está o desempenho da carteira.

Investidores experientes: acompanham ativamente ações e fundos imobiliários, possuem carteiras mais diversificadas e valorizam dados atualizados, indicadores de desempenho por ativo e a visão de alocação por classe. Têm maior familiaridade com tecnologia e exigem precisão nas informações e rapidez na navegação.
