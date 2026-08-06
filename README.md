<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:2F1E1A,45:6F3B46,100:B8844F&height=220&section=header&text=BELEZA%20SEM%20LACUNAS&fontSize=42&fontColor=FCF8F3&fontAlignY=36&desc=Análise%20de%20inclusão%20de%20tons%20no%20mercado%20brasileiro%20de%20cosméticos&descAlignY=58&descSize=17" alt="Banner do projeto"/>

<img src="https://readme-typing-svg.demolab.com?font=Montserrat&weight=600&size=19&pause=1200&color=B8844F&center=true&vCenter=true&width=900&lines=Dados+que+transformam+representatividade+em+decisão;12+marcas+%7C+23+linhas+de+produtos+%7C+175+tonalidades;Python+%2B+Power+BI+%2B+Storytelling+%2B+Impacto+Social" alt="Animação de apresentação"/>

<br/>



</div>

🚧 Status do projeto

<div align="center">

EM DESENVOLVIMENTO

A base inicial, a metodologia e a identidade visual já foram estruturadas.A equipe está trabalhando nas etapas de tratamento dos dados, análise em Python, dashboard no Power BI, storytelling e validação final.



</div>

O conteúdo, os indicadores, as visualizações e as conclusões podem ser atualizados conforme o avanço das sprints e a validação das evidências.

🌍 Sobre o projeto

Beleza sem Lacunas é um projeto de análise de dados criado para investigar se a oferta de cosméticos no Brasil acompanha, de fato, a diversidade da população brasileira.

A análise parte de uma pergunta central:

As marcas oferecem variedade, profundidade de tons, subtons, preço e disponibilidade suficientes para atender peles negras e retintas com qualidade e representatividade?

O projeto foi desenvolvido durante o Bootcamp Generation de Análise de Dados e também apoia a construção da proposta da Aurena, uma marca fictícia de cosméticos inclusivos criada para valorizar a pluralidade das peles brasileiras.

Mais do que contar quantos tons uma marca possui, este projeto procura entender:

quantos tons escuros ou retintos estão realmente disponíveis;

quais subtons são contemplados;

se os produtos possuem preços acessíveis;

se a comunicação inclusiva é acompanhada por oferta real;

quais lacunas ainda existem no mercado;

como os dados podem apoiar decisões de produto, marketing e posicionamento.

✨ Por que este projeto importa?

Segundo o Censo Demográfico de 2022 do IBGE, pessoas pretas e pardas representam aproximadamente 55,5% da população brasileira.

Mesmo assim, consumidores ainda podem encontrar dificuldades relacionadas a:

baixa variedade de tons profundos;

ausência de subtons adequados;

produtos indisponíveis;

diferenças de preço;

comunicação inclusiva sem profundidade de oferta;

dificuldade para encontrar informações padronizadas nas lojas.

Este projeto transforma essas questões em uma análise estruturada e baseada em evidências.

🎯 Objetivos

Objetivo principal

Avaliar o nível de inclusão das principais linhas de maquiagem comercializadas no Brasil, considerando diferentes dimensões de oferta e acesso.

Objetivos específicos

construir uma base nacional organizada e rastreável;

comparar a quantidade de tons entre marcas;

identificar tons destinados a peles negras, escuras e retintas;

analisar famílias e temperaturas de subtom;

comparar preços regulares e promocionais;

observar disponibilidade e possíveis lacunas de estoque;

criar um índice exploratório de inclusão;

desenvolver visualizações no Python e Power BI;

transformar os resultados em storytelling para tomada de decisão.

📊 Dimensão da base

<div align="center">

Indicador

Resultado

🏷️ Marcas analisadas

12

💄 Linhas de produtos

23

🎨 Tonalidades individualizadas

175

🔗 Fontes registradas

29

📅 Data principal da coleta

05/08/2026

🇧🇷 Fonte demográfica

IBGE — Censo 2022

</div>

Marcas presentes na pesquisa

Negra Rosa · Dailus · Bruna Tavares · Vizzela · Natura · O Boticário / Make B. · Boca Rosa · Eudora · Avon · Ruby Rose · Mari Maria Makeup · Catharine Hill

🧠 Perguntas que orientam a análise

Quais marcas possuem as maiores cartelas de tons?

Uma cartela maior significa, necessariamente, maior inclusão?

Qual é a proporção confirmada de tons escuros ou retintos?

Quais marcas apresentam maior diversidade de subtons?

Existe diferença relevante de preço entre as linhas?

Os tons mais escuros estavam disponíveis no momento da coleta?

Quais produtos possuem evidências suficientes para comparação?

Quais oportunidades de mercado podem apoiar a proposta da Aurena?

🗂️ Estrutura dos dados

linhas_produtos.csv

Base principal, com uma linha por produto ou linha de maquiagem.

Principais campos:

Campo

Descrição

ID_Linha

Identificador único do produto

Marca

Nome da marca

Produto

Nome da linha analisada

Preço Regular

Preço cheio no momento da coleta

Preço Promocional

Preço promocional observado

Qtd. Tons Total

Quantidade oficial de tonalidades

Tons Negros/Escuros Confirmados

Quantidade confirmada por fonte oficial

Tons Negros/Escuros Estimados

Estimativa analítica separada

Qtd. Famílias Subtom

Quantidade de famílias de subtom

FPS

Fator de proteção solar

Vegano

Informação declarada pela marca

Cruelty Free

Informação declarada pela marca

Disponibilidade

Situação observada na data de coleta

Status Validação

Confirmado, parcial ou pendente

Confiança

Alta, média ou baixa

Fonte Principal

Página oficial utilizada

Score Normalizado

Resultado do índice exploratório

Cobertura Evidência

Percentual de informações confirmadas

tons_detalhados.csv

Base granular, com uma linha para cada tonalidade individualizada.

Principais campos:

código do tom;

nome ou descrição;

profundidade oficial;

profundidade analítica;

família de subtom;

temperatura do subtom;

disponibilidade;

indicação para pele negra;

método de classificação;

nível de confiança;

fonte utilizada.

fontes.csv

Tabela de auditoria com:

identificação da fonte;

tipo da fonte;

finalidade;

URL;

informação confirmada;

data de acesso.

marcas.csv

Cadastro das marcas, segmentos, posicionamentos observados e sites oficiais.

🧪 Tratamento e metodologia

A metodologia foi construída para não misturar fatos com interpretações.

Níveis de evidência

Classificação

Significado

✅ Dado oficial

Informação declarada diretamente pela marca

🟡 Classificação analítica

Interpretação baseada na sequência, prefixo ou organização da cartela

⚠️ Estimativa

Valor usado somente para exploração e não tratado como confirmação

Essa separação evita apresentar inferências como se fossem informações oficiais.

📐 Índice exploratório de inclusão

O índice foi criado para apoiar comparações, mas não representa selo, certificação ou julgamento definitivo de uma marca.

Dimensões avaliadas

Dimensão

Peso máximo

Diversidade total da cartela

25 pontos

Tons escuros ou retintos confirmados

35 pontos

Diversidade de subtons

15 pontos

Acessibilidade de preço

10 pontos

Posicionamento inclusivo

15 pontos

Total

100 pontos

Regra de segurança

Um produto só pode participar do ranking quando possui pelo menos 75% de cobertura de evidências.

Isso impede que uma marca seja classificada como altamente inclusiva apenas por possuir muitos tons, sem informações suficientes sobre profundidade, subtons ou acesso.

🔄 Pipeline do projeto

flowchart LR
    A[Coleta em fontes oficiais] --> B[Base bruta]
    B --> C[Limpeza e padronização]
    C --> D[Validação das evidências]
    D --> E[Classificação de tons e subtons]
    E --> F[Análise exploratória em Python]
    F --> G[Indicadores e ranking elegível]
    G --> H[Dashboard no Power BI]
    H --> I[Storytelling e recomendações]

🛠️ Tecnologias utilizadas

<div align="center">



</div>

📁 Estrutura recomendada do repositório

beleza-sem-lacunas/
│
├── data/
│   ├── raw/
│   │   └── bases_originais/
│   │
│   └── processed/
│       ├── linhas_produtos.csv
│       ├── tons_detalhados.csv
│       ├── marcas.csv
│       └── fontes.csv
│
├── notebooks/
│   ├── 01_exploracao_inicial.ipynb
│   ├── 02_tratamento_etl.ipynb
│   └── 03_analise_exploratoria.ipynb
│
├── dashboard/
│   └── projeto_inclusao_tons.pbix
│
├── assets/
│   ├── dashboard-preview.png
│   ├── identidade-aurena.png
│   └── graficos/
│
├── docs/
│   ├── metodologia.md
│   └── dicionario_de_dados.md
│
├── requirements.txt
└── README.md

▶️ Como executar o projeto

1. Clone o repositório

git clone URL_DO_SEU_REPOSITORIO
cd beleza-sem-lacunas

2. Crie o ambiente virtual

Windows

python -m venv .venv
.venv\Scripts\activate

Linux ou macOS

python3 -m venv .venv
source .venv/bin/activate

3. Instale as dependências

pip install -r requirements.txt

4. Abra o projeto

jupyter notebook

Depois, execute os notebooks na seguinte ordem:

01_exploracao_inicial.ipynb

02_tratamento_etl.ipynb

03_analise_exploratoria.ipynb

📦 Dependências principais

Exemplo de requirements.txt:

pandas
numpy
matplotlib
openpyxl
jupyter
ipykernel

🔎 Exemplos de análises

Carregando a base principal

import pandas as pd

linhas = pd.read_csv(
    "data/processed/linhas_produtos.csv",
    encoding="utf-8-sig"
)

linhas.head()

Ranking por quantidade de tons

ranking_tons = (
    linhas[["Marca", "Produto", "Qtd. Tons Total"]]
    .dropna()
    .sort_values("Qtd. Tons Total", ascending=False)
)

ranking_tons.head(10)

Filtrando produtos elegíveis

elegiveis = linhas[
    linhas["Elegivel_Ranking"] == "Sim"
].copy()

elegiveis.sort_values(
    "Score_Normalizado",
    ascending=False
)

Relacionando produtos e tonalidades

tons = pd.read_csv(
    "data/processed/tons_detalhados.csv",
    encoding="utf-8-sig"
)

base_completa = tons.merge(
    linhas,
    on="ID_Linha",
    how="left",
    suffixes=("_tom", "_produto")
)

📈 Dashboard

Adicione abaixo uma captura do dashboard final do Power BI.

<p align="center">
  <img src="assets/dashboard-preview.png" width="95%" alt="Dashboard do projeto">
</p>

O dashboard poderá apresentar:

total de marcas e produtos;

maior cartela de tons;

preço médio;

proporção de tons escuros confirmados;

distribuição de subtons;

produtos elegíveis para ranking;

disponibilidade dos tons;

comparação entre marcas;

contexto demográfico do IBGE.

💡 Hipóteses e oportunidades

A base permite investigar hipóteses como:

marcas com cartelas maiores podem não possuir distribuição proporcional de tons profundos;

produtos mais caros não apresentam necessariamente maior inclusão;

diversidade de subtom pode ser uma lacuna tão importante quanto a quantidade total;

ausência de estoque pode limitar a inclusão mesmo quando o tom aparece no catálogo;

marcas especializadas podem possuir menor quantidade total, porém maior foco em peles negras;

existe espaço para uma marca unir representatividade, variedade, disponibilidade e experiência de compra.

Essas oportunidades ajudam a construir a proposta da Aurena:

Uma marca brasileira de cosméticos inclusivos que transforma diversidade em produto, experiência e pertencimento.

⚠️ Limitações

preços e estoques mudam com frequência;

nem todas as marcas apresentam seus dados de forma estruturada;

algumas classificações de profundidade foram analíticas;

quantidade de tons não mede sozinha a qualidade da inclusão;

cor ou raça autodeclarada pelo IBGE não equivale diretamente a tom cosmético;

o índice criado é exploratório;

a base não representa um censo completo do mercado brasileiro.

Os dados de preço e disponibilidade devem ser revisados antes da apresentação final.

🔗 Fontes e rastreabilidade

Foram priorizadas:

páginas oficiais das marcas;

catálogos oficiais;

páginas individuais de produtos;

guias de tonalidades;

páginas institucionais;

dados públicos do IBGE.

Todas as referências utilizadas estão disponíveis em:

data/processed/fontes.csv

Cada registro informa a URL, a data de acesso e a evidência confirmada.

👥 Equipe do projeto

<div align="center">

<table>
  <tr>
    <td align="center" width="33%">
      <h3>🎨 Cassiano</h3>
      <img src="https://img.shields.io/badge/DESIGN%20%26%20STORYTELLING-2F1E1A?style=for-the-badge" alt="Design e Storytelling"/>
      <br/><br/>
      <strong>Identidade visual e narrativa</strong>
      <br/>
      <sub>Design, storytelling, documentação e apresentação.</sub>
    </td>
    <td align="center" width="33%">
      <h3>✨ Ju</h3>
      <img src="https://img.shields.io/badge/DESIGN%20%26%20APRESENTAÇÃO-B8844F?style=for-the-badge" alt="Design e Apresentação"/>
      <br/><br/>
      <strong>Experiência visual</strong>
      <br/>
      <sub>Design, storytelling e apoio na apresentação.</sub>
    </td>
    <td align="center" width="33%">
      <h3>🐍 Adrielle</h3>
      <img src="https://img.shields.io/badge/PYTHON%20%26%20ETL-6F3B46?style=for-the-badge" alt="Python e ETL"/>
      <br/><br/>
      <strong>Preparação dos dados</strong>
      <br/>
      <sub>Python, limpeza, padronização e tratamento dos dados.</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <h3>📊 Karla</h3>
      <img src="https://img.shields.io/badge/PYTHON%20%26%20EDA-A65F46?style=for-the-badge" alt="Python e EDA"/>
      <br/><br/>
      <strong>Análise exploratória</strong>
      <br/>
      <sub>Python, investigação dos dados, métricas e gráficos.</sub>
    </td>
    <td align="center" width="33%">
      <h3>📈 Ana</h3>
      <img src="https://img.shields.io/badge/POWER%20BI%20%26%20INDICADORES-C78F62?style=for-the-badge" alt="Power BI e Indicadores"/>
      <br/><br/>
      <strong>Indicadores estratégicos</strong>
      <br/>
      <sub>Power BI, construção das métricas e organização do dashboard.</sub>
    </td>
    <td align="center" width="33%">
      <h3>📉 Waandernilson</h3>
      <img src="https://img.shields.io/badge/POWER%20BI%20%26%20VISUALIZAÇÃO-2F1E1A?style=for-the-badge" alt="Power BI e Visualização"/>
      <br/><br/>
      <strong>Visualização dos dados</strong>
      <br/>
      <sub>Power BI, desenvolvimento dos visuais e apoio ao dashboard.</sub>
    </td>
  </tr>
</table>

</div>

As responsabilidades podem ser atualizadas conforme a evolução das sprints e as necessidades do projeto.

🗓️ Roadmap

Definição do problema

Identidade e conceito da Aurena

Coleta inicial das marcas nacionais

Construção da base profissional

Registro das fontes

Dicionário de dados

Metodologia do índice exploratório

Limpeza final no Python

Análise exploratória

Criação dos gráficos

Construção do dashboard

Desenvolvimento do storytelling

Validação dos principais resultados

Apresentação final

🌟 Resultado esperado

Ao final, o projeto deverá entregar:

uma base nacional estruturada;

um processo de ETL documentado;

análises reproduzíveis em Python;

um dashboard interativo;

indicadores de inclusão;

recomendações para a Aurena;

storytelling orientado a impacto social e oportunidade de mercado.

🤝 Contribuições

Sugestões, correções e novas fontes são bem-vindas.

Para contribuir:

faça um fork;

crie uma branch;

registre a fonte utilizada;

descreva a alteração;

envie um pull request.

git checkout -b melhoria/nova-fonte
git commit -m "docs: adiciona nova fonte de tonalidades"
git push origin melhoria/nova-fonte

💬 Mensagem final

Representatividade não deve existir apenas na campanha.Ela precisa estar presente no produto, no preço, no estoque e na experiência.

<div align="center">

Dados que enxergam pessoas.

Beleza que reconhece presenças.

<br/>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:B8844F,50:6F3B46,100:2F1E1A&height=130&section=footer"/>

</div>
