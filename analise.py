# -*- coding: utf-8 -*-
"""
Created on Tue Mar  9 17:24:01 2021

@author: Daniel Alves
"""
import pandas as pd
import numpy as np
import seaborn as sns


#leitura da base de dados
df_Lencois = pd.read_csv('./dataset/mergedData/merged_dados_Lencois.csv')

#visualizando a distribuição da amostra
ax = sns.countplot(x="has_Foco", data=df_Lencois)

#salvando o que será previsto em outra variável
previsao = df_Lencois['has_Foco'].values

#removendo coluna de previsão
df_Lencois = df_Lencois.drop(columns='has_Foco')

#separando data por dia e mês
'''
data = []
for i in range(len(df_Lencois)):
    data.append(df_Lencois['Data Medicao'][i].split('/'))

df_Lencois['DIA'] = 'NaN'
df_Lencois['MES'] = 'NaN'

for i in range(len(df_Lencois)):
    df_Lencois['DIA'][i] = float(data[i][0])
    df_Lencois['MES'][i] = float(data[i][1])
'''
#removendo coluna de data
df_Lencois = df_Lencois.drop(columns='Data Medicao')

#valores para realizar a previsão
previsores = df_Lencois.iloc[:,:].values


################################## IGUALANDO QUANTIDADE DE AMOSTRAS #####################
################################## NEARMISS #############################################
#É um algoritmo de undersampling que consiste em reduzir de 
#forma aleatória os exemplos da classe majoritária, porém ele 
#seleciona os exemplos com base na distância.
from imblearn.under_sampling import NearMiss


#instanciando a função
nr = NearMiss()

#aplica o NearMiss
previsores, previsao = nr.fit_resample(previsores, previsao)

#checa a quantidade de amostras entre as classes
ax = sns.countplot(x=previsao)


################################## SMOTE ###############################################
#Consiste em gerar dados sintéticos (não duplicados) 
#da classe minoritária a partir de vizinhos.
from imblearn.over_sampling import SMOTE


#visualizando a quantidade de dados por classe
np.bincount(previsao)

#instanciando a função
smt = SMOTE()

#aplica o SMOTE nos dados
previsores, previsao = smt.fit_resample(previsores, previsao)

#visualizando a quantidade de dados por classe
np.bincount(previsao)

#visualizando a distribuição das amostras
ax = sns.countplot(x=previsao)


################################### ANÁLISE DE DADOS ####################################
from pandas_profiling import ProfileReport


df = pd.DataFrame(data = previsores, 
                  columns=(['PRECIPITACAO_TOTAL', 'TEMPERATURA_MEDIA', 'UMIDADE']))

df.insert(3, "has_Foco",previsao,True)

#aplicando a análise
profile = ProfileReport(df, title="Pandas Profiling Report")

#gerando arquivo para vizualização
profile.to_file("your_report_SMOTE.html")


################################### CLASSIFICAÇÃO DA REDE ###################################
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, mean_absolute_error, accuracy_score,classification_report


#dividindo dados em teste e treinamento 
# Usou-se 25%(test_size = 0.25) como quantidade de atributos para teste e o restante para treinamento
previsores_treinamento, previsores_teste, previsao_treinamento, previsao_teste = train_test_split(previsores, previsao, test_size=0.25, random_state=0)

#atribuindo a função a uma variável para ser utilizada
lr = LogisticRegression()

#treinando o modelo com os valores separados para treinamento
lr.fit(previsores_treinamento, previsao_treinamento)

#realizando previção do dados para 'previsores_teste'
y_pred = lr.predict(previsores_teste)

#checa a acurácia do modelo
accuracy_score(previsao_teste, y_pred)

#relatório de classificação
print (classification_report(previsao_teste, y_pred))

#matriz de confusão
print (pd.crosstab(previsao_teste, y_pred, rownames=['Real'], colnames=['Predito'], margins=True))
