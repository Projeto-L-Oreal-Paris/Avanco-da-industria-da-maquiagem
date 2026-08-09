import os
import pandas as pd
import requests
import urllib3
from sqlalchemy import create_engine

# ------------------------------------------------------------------------------
# 1. CONFIGURAÇÕES INICIAIS
# ------------------------------------------------------------------------------

# Desativa avisos visuais de segurança (SSL) no terminal ao fazer requisições HTTP.
# Fazemos isso para evitar que mensagens amareladas de alerta poluam o console.
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def rodar_pipeline_sql():
    """
    Função principal que executa o Pipeline de Dados (ETL):
    1. Extract (Extração): Busca dados populacionais direto da API do Censo 2022 (IBGE).
    2. Transform (Transformação): Limpa, organiza e cria regras cosméticas nos dados.
    3. Load (Carregamento): Cria a tabela e insere os dados no banco MySQL Workbench.
    """
    print("🚀 Iniciando o pipeline de dados do IBGE...")
    print("1/3. Conectando à API do IBGE (Censo 2022)...")

    # URL (endpoint) oficial do IBGE para a Tabela 9606 do Censo 2022
    # Essa consulta traz a população distribuída por Cor ou Raça para cada Estado brasileiro.
    url = "https://servicodados.ibge.gov.br/api/v3/agregados/9606/periodos/2022/variaveis/93?localidades=N3[all]&classificacao=86[all]"

    # --------------------------------------------------------------------------
    # FASE 1: EXTRAÇÃO (FETCH DE DADOS NA API)
    # --------------------------------------------------------------------------
    try:
        # requests.get(): O Python envia uma solicitação para a internet buscando o endereço da API.
        # timeout=15: Se o servidor do IBGE demorar mais de 15 segundos para responder, ele aborta.
        response = requests.get(url, verify=False, timeout=15)

        # O código de status 200 é o padrão do protocolo HTTP para "Sucesso / Deu Tudo Certo".
        if response.status_code == 200:
            dados_json = response.json() # Converte a resposta bruta do servidor em uma estrutura de dicionário Python
            resultados = dados_json[0]['resultados']
            lista_registros = [] # Lista vazia para ir guardando as linhas formatadas

            # NAVEGAÇÃO NO JSON DA API:
            # A resposta da API do IBGE é uma estrutura aninhada (listas dentro de dicionários).
            # Precisamos "desempacotar" essas camadas para transformar em uma tabela simples.
            for res in resultados:
                # Pega a categoria de Cor/Raça (ex: Branca, Parda, Preta, Amarela, Indígena)
                cat_dict = res['classificacoes'][0]['categoria']
                cat_id = list(cat_dict.keys())[0]
                cor_raca = cat_dict[cat_id]

                # O IBGE envia uma categoria chamada "Total" que é a soma de todas as raças.
                # Ignoramos o "Total" para não duplicar valores na nossa análise final.
                if "Total" in cor_raca:
                    continue

                # Percorre cada Estado (localidade) retornado no resultado
                for serie in res['series']:
                    estado = serie['localidade']['nome']
                    valor_str = list(serie['serie'].values())[0] # População como texto

                    # Converte o valor de texto da população para número inteiro
                    try:
                        populacao = int(valor_str)
                    except ValueError:
                        populacao = None # Se o dado vier nulo ou inválido, define como None (NULL)

                    # Salva os dados limpos em formato de dicionário
                    lista_registros.append({
                        'Estado': estado,
                        'Cor_Raca_Declarada': cor_raca,
                        'Populacao': populacao
                    })

            # Converte a lista de dicionários em um DataFrame (tabela) do Pandas
            df = pd.DataFrame(lista_registros)
            print("✅ Dados extraídos da API do IBGE com sucesso!")

        else:
            # Caso a API responda algo diferente de 200 (ex: erro 404 ou 500)
            raise Exception(f"Erro no servidor do IBGE! Código HTTP: {response.status_code}")

    # PLANO DE CONTINGÊNCIA (FALLBACK):
    # Se a internet cair ou o site do IBGE estiver fora do ar, o bloco except entra em ação.
    # Ele cria uma pequena base mockada (estática) para o código não quebrar durante testes do time.
    except Exception as e:
        print(f"⚠️ Aviso ao conectar na API ({e}). Usando dados estáticos de contingência...")
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
    print("2/3. Transformando e aplicando regras de negócio nos dados...")

    # MAPA GEOGRÁFICO: Dicionário relacionando cada Estado à sua Região macro.
    regioes = {
        'Acre': 'Norte', 'Amapá': 'Norte', 'Amazonas': 'Norte', 'Pará': 'Norte', 'Rondônia': 'Norte', 'Roraima': 'Norte', 'Tocantins': 'Norte',
        'Alagoas': 'Nordeste', 'Bahia': 'Nordeste', 'Ceará': 'Nordeste', 'Maranhão': 'Nordeste', 'Paraíba': 'Nordeste', 'Pernambuco': 'Nordeste', 'Piauí': 'Nordeste', 'Rio Grande do Norte': 'Nordeste', 'Sergipe': 'Nordeste',
        'Distrito Federal': 'Centro-Oeste', 'Goiás': 'Centro-Oeste', 'Mato Grosso': 'Centro-Oeste', 'Mato Grosso do Sul': 'Centro-Oeste',
        'Espírito Santo': 'Sudeste', 'Minas Gerais': 'Sudeste', 'Rio de Janeiro': 'Sudeste', 'São Paulo': 'Sudeste',
        'Paraná': 'Sul', 'Rio Grande do Sul': 'Sul', 'Santa Catarina': 'Sul'
    }
    # Cria a coluna 'Regiao' mapeando os nomes dos estados
    df['Regiao'] = df['Estado'].map(regioes).fillna('Outro')

    # REGRA DE NEGÓCIO DERMO-COSMÉTICA:
    # Função interna para classificar o perfil do consumidor com base na etnia e região climática.
    def classificar_perfil_pele(row):
        raca = row['Cor_Raca_Declarada']
        regiao = row['Regiao']

        # Classificação do Fototipo (Escala Dermatológica de Fitzpatrick) e Subtom de Pele
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

        # Textura recomendada de acordo com o clima/umidade característico da Região
        if regiao in ['Norte', 'Nordeste']:
            textura = 'Matte Alta Resistência' # Regiões mais quentes/úmidas
        elif regiao == 'Sul':
            textura = 'Hidratante'             # Região mais fria
        else:
            textura = 'Soft Matte'             # Regiões intermediárias

        # Retorna os 3 valores em sequência
        return pd.Series([fototipo, subtom, textura])

    # Aplica a função linha por linha no DataFrame e cria as 3 novas colunas simultaneamente
    df[['Fototipo_Fitzpatrick', 'Subtom_Predominante', 'Textura_Recomendada']] = df.apply(classificar_perfil_pele, axis=1)

    # --------------------------------------------------------------------------
    # FASE 3: CARREGAMENTO (CONEXÃO E PERSISTÊNCIA NO MYSQL WORKBENCH)
    # --------------------------------------------------------------------------
    print("3/3. Conectando ao MySQL Workbench e salvando a tabela...")

    # PARAMETROS DE CONEXÃO:
    # Ajuste o valor da SENHA para a senha que você/sua colega criaram na instalação do MySQL.
    USUARIO = "root"              # Usuário padrão do MySQL
    SENHA = "''''''''''''"      # ⚠️ Coloque a senha local do seu MySQL Workbench aqui
    HOST = "localhost"            # Indica que o banco de dados está rodando na própria máquina
    PORTA = "3306"                # Porta padrão do MySQL
    NOME_BANCO = "banco_beleza"   # O Schema/Banco de dados criado no MySQL Workbench
    NOME_TABELA = "demografia_pele_ibge"

    # String de Conexão (URL de Conexão SQLAlchemy):
    # Formato: mysql+pymysql://usuario:senha@host:porta/nome_do_banco
    string_conexao = f"mysql+pymysql://{USUARIO}:{SENHA}@{HOST}:{PORTA}/{NOME_BANCO}"
    
    # create_engine: É a ponte/motor de comunicação gerenciada pelo SQLAlchemy
    engine = create_engine(string_conexao)

    # df.to_sql(): Envia o DataFrame do Pandas direto para o MySQL
    # if_exists="replace": Se a tabela já existir no banco, ele sobrescreve com os novos dados
    # index=False: Não salva a coluna de índices numéricos (0, 1, 2...) do Pandas no banco
    df.to_sql(NOME_TABELA, con=engine, if_exists="replace", index=False)

    print("\n✨ PIPELINE FINALIZADO COM SUCESSO!")
    print(f"📊 Tabela '{NOME_TABELA}' criada e disponível no schema '{NOME_BANCO}' no MySQL Workbench!")

# Este bloco garante que o código só vai rodar se você executar este arquivo diretamente
if __name__ == "__main__":
    rodar_pipeline_sql()