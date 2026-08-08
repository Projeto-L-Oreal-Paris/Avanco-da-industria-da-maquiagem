import os
import pandas as pd
import requests
import urllib3
from sqlalchemy import create_engine

# ------------------------------------------------------------------------------
# CONFIGURAÇÕES INICIAIS E LIMPEZA DE AMBIENTE
# ------------------------------------------------------------------------------

# Oculta avisos de alertas de SSL/segurança no terminal ao fazer requisições HTTP
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Lista de arquivos gerados em execuções anteriores que serão apagados antes de começar,
# garantindo que não haja resíduos de dados antigos
for arquivo_antigo in ["dataset_pele_brasileira_insight.csv", "banco_beleza.db"]:
    if os.path.exists(arquivo_antigo):
        try:
            os.remove(arquivo_antigo)
        except Exception:
            pass # Se der erro ao apagar (ex: arquivo em uso), ignora e prossegue

def rodar_pipeline_sql():
    # Executa a conexão na API do IBGE, processa os dados populacionais do Censo 2022,
    #enriquece a tabela com classificações cosméticas/dermatológicas e salva no SQLite.
    print("1. Conectando à API do IBGE (Censo 2022)...")

    # Endereço (endpoint) da API do IBGE contendo a Tabela 9606 do Censo 2022
    # (População por Cor ou Raça em nível estadual)
    url = "https://servicodados.ibge.gov.br/api/v3/agregados/9606/periodos/2022/variaveis/93?localidades=N3[all]&classificacao=86[all]"

    # --------------------------------------------------------------------------
    # FASE 1: EXTRAÇÃO (GET REQUEST NA API DO IBGE)
    # --------------------------------------------------------------------------

    try:
        # Faz a chamada HTTP para buscar a resposta no servidor do IBGE
        response = requests.get(url, verify=False, timeout=15)

        # Código 200 indica que a requisição foi bem-sucedida
        if response.status_code == 200:
            dados_json = response.json()
            resultados = dados_json[0]['resultados']
            lista_registros = [] # Lista temporária para guardar os dados extraídos

            # Navega na estrutura aninhada de dados do formato JSON retornado
            for res in resultados:
                # Extrai o nome da categoria de cor/raça (ex: Branca, Parda, Preta)
                cat_dict = res['classificacoes'][0]['categoria']
                cat_id = list(cat_dict.keys())[0]
                cor_raca = cat_dict[cat_id]

                # Descarta o registro "Total" para manter apenas os recortes específicos
                if "Total" in cor_raca:
                    continue

                # Itera sobre cada estado (localidade) retornado na série temporal    
                for serie in res['series']:
                    estado = serie['localidade']['nome']
                    valor_str = list(serie['serie'].values())[0]

                    # Converte a contagem de população para inteiro
                    try:
                        populacao = int(valor_str)
                    except ValueError:
                        populacao = None  # Gravado como NULL no banco SQLite e Power BI

                    # Armazena o registro formatado    
                    lista_registros.append({
                        'Estado': estado,
                        'Cor_Raca_Declarada': cor_raca,
                        'Populacao': populacao
                    })
            # Converte a lista de dicionários em um DataFrame (tabela) do Pandas
            df = pd.DataFrame(lista_registros)
        else:
            raise Exception(f"HTTP Status {response.status_code}")

    # Plano de contingência (Fallback): Se a internet falhar ou a API do IBGE ficar fora do ar,
    # o código gera dados estáticos com base no Censo para permitir a execução contínua do projeto.
    except Exception as e:
        print(f"Aviso na API ({e}). Gerando estrutura com dados consolidados do Censo 2022...")
        df = pd.DataFrame([
            {'Estado': 'São Paulo', 'Cor_Raca_Declarada': 'Branca', 'Populacao': 24700000},
            {'Estado': 'São Paulo', 'Cor_Raca_Declarada': 'Parda', 'Populacao': 16100000},
            {'Estado': 'São Paulo', 'Cor_Raca_Declarada': 'Preta', 'Populacao': 3800000},
            {'Estado': 'Bahia', 'Cor_Raca_Declarada': 'Parda', 'Populacao': 8100000},
            {'Estado': 'Bahia', 'Cor_Raca_Declarada': 'Preta', 'Populacao': 3100000},
            {'Estado': 'Rio de Janeiro', 'Cor_Raca_Declarada': 'Branca', 'Populacao': 7200000},
            {'Estado': 'Rio de Janeiro', 'Cor_Raca_Declarada': 'Parda', 'Populacao': 6300000},
            {'Estado': 'Rio de Janeiro', 'Cor_Raca_Declarada': 'Preta', 'Populacao': 2300000},
        ])

    # --------------------------------------------------------------------------
    # FASE 2: TRANSFORMAÇÃO E ENRIQUECIMENTO DOS DADOS
    # --------------------------------------------------------------------------
    
    # 2.1 Mapeamento Geográfico: Associa cada Estado brasileiro à sua respectiva Região
    regioes = {
        'Acre': 'Norte', 'Amapá': 'Norte', 'Amazonas': 'Norte', 'Pará': 'Norte', 'Rondônia': 'Norte', 'Roraima': 'Norte', 'Tocantins': 'Norte',
        'Alagoas': 'Nordeste', 'Bahia': 'Nordeste', 'Ceará': 'Nordeste', 'Maranhão': 'Nordeste', 'Paraíba': 'Nordeste', 'Pernambuco': 'Nordeste', 'Piauí': 'Nordeste', 'Rio Grande do Norte': 'Nordeste', 'Sergipe': 'Nordeste',
        'Distrito Federal': 'Centro-Oeste', 'Goiás': 'Centro-Oeste', 'Mato Grosso': 'Centro-Oeste', 'Mato Grosso do Sul': 'Centro-Oeste',
        'Espírito Santo': 'Sudeste', 'Minas Gerais': 'Sudeste', 'Rio de Janeiro': 'Sudeste', 'São Paulo': 'Sudeste',
        'Paraná': 'Sul', 'Rio Grande do Sul': 'Sul', 'Santa Catarina': 'Sul'
    }
    df['Regiao'] = df['Estado'].map(regioes).fillna('Outro')

    # 2.2 Função com Regras Dermo-Cosméticas
    # Associa a cor/raça declarada do IBGE e a região a estimativas de pele para análise de mercado
    def classificar(row):
        raca = row['Cor_Raca_Declarada']
        regiao = row['Regiao']

    # Mapeamento do Fototipo Fitzpatrick (escala dermatológica I a VI) e Subtom    
        if raca == 'Branca':
            fototipo = 'II a III'
            subtom = 'Neutro / Rosado' if regiao == 'Sul' else 'Amarelado / Neutro'
        elif raca == 'Parda':
            fototipo = 'IV a V'
            subtom = 'Oliva / Amarelado'
        elif raca == 'Preta':
            fototipo = 'V a VI'
            subtom = 'Neutro / Quente'
        elif raca == 'Amarela':
            fototipo = 'III'
            subtom = 'Amarelado / Quente'
        else:
            fototipo = 'III a IV'
            subtom = 'Neutro'

        # Estimativa de textura recomendada de produto com base no clima regional    
        textura = 'Matte Alta Resistência' if regiao in ['Norte', 'Nordeste'] else ('Hidratante' if regiao == 'Sul' else 'Soft Matte')
        return pd.Series([fototipo, subtom, textura])
    # Aplica a função linha a linha e cria 3 novas colunas na tabela
    df[['Fototipo_Fitzpatrick', 'Subtom_Predominante', 'Textura_Recomendada']] = df.apply(classificar, axis=1)

# --------------------------------------------------------------------------
    # FASE 3: CARREGAMENTO (PERSISTÊNCIA NO BANCO MYSQL)
    # --------------------------------------------------------------------------
    
    # Preencha com as credenciais do seu MySQL Workbench:
    USUARIO = "root"              # Seu usuário do MySQL
    SENHA = "magalhaes"      # Digite sua senha entre as aspas
    HOST = "localhost"            # Mantenha localhost
    PORTA = "3306"                # Porta padrão do MySQL
    NOME_BANCO = "banco_beleza"   # O nome do Schema criado no seu MySQL Workbench
    NOME_TABELA = "demografia_pele_ibge"

    # String de conexão do SQLAlchemy para MySQL
    string_conexao = f"mysql+pymysql://{USUARIO}:{SENHA}@{HOST}:{PORTA}/{NOME_BANCO}"
    
    # Cria o motor de conexão
    engine = create_engine(string_conexao)

    # Grava o DataFrame diretamente como tabela no MySQL Workbench
    df.to_sql(NOME_TABELA, con=engine, if_exists="replace", index=False)

    print(f"\n✅ BANCO DE DADOS MYSQL POPULADO COM SUCESSO!")
    print(f"📁 Tabela '{NOME_TABELA}' criada no schema '{NOME_BANCO}' no MySQL Workbench!")

# Executa a função do pipeline
rodar_pipeline_sql()