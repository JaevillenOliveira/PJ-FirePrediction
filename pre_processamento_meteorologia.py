# -*- coding: utf-8 -*-
"""
Created on Wed Feb 10 10:29:40 2021

@author: Adlla Katarine e Daniel Alves 
"""


import pandas as pd
import math


#leitura dados
df_lencois = pd.read_csv('.//dataset//meteorologia//dados_Lencois.csv')
df_piata = pd.read_csv('.//dataset//meteorologia//dados_Piata.csv')

#exibir quantidade de valores nulos em cada atributo
df_lencois.isnull().sum() 
df_piata.isnull().sum()


#####################################TRATAMENTO DE DADOS############################
def tratamento(df):
    #Na precipitação foi optado por utilizar o valor mais frequente, por ter valores muito distantes e conter a mesma quantidade de um mesmo número
    #identificar o mais frequente
    print(df['PRECIPITACAO TOTAL; DIARIO (AUT)(mm)'].value_counts())
    #valor mais frequente
    precipitacao_freq = 0.0
    
    #preencher os valores faltantes com o mais frequente
    df['PRECIPITACAO TOTAL; DIARIO (AUT)(mm)'].fillna(precipitacao_freq, inplace=True)


    #Na outras variáveis foi utilizado a média por o crescimento dos valores ter uma menor variação e não conter dados com o mesmo valor
    #calculando a média
    temperatura_media = df['TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)'].mean()
    umidade_media = df['UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)'].mean()
    vento_media = df['VENTO; VELOCIDADE MEDIA DIARIA (AUT)(m/s)'].mean()
    
    #arredondando o valor
    temperatura_media = math.floor(temperatura_media)
    umidade_media = math.floor(umidade_media)
    vento_media = math.floor(vento_media)

    #preencher os valores faltantes com a média
    df['TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)'].fillna(temperatura_media, inplace=True)
    df['UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)'].fillna(umidade_media, inplace=True)
    df['VENTO; VELOCIDADE MEDIA DIARIA (AUT)(m/s)'].fillna(vento_media, inplace=True)
    
    
tratamento(df_lencois)
tratamento(df_piata)

#exibir quantidade de valores nulos em cada atributo
df_lencois.isnull().sum() 
df_piata.isnull().sum()








