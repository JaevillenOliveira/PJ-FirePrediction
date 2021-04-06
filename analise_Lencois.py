# -*- coding: utf-8 -*-
"""
Created on Tue Mar  9 17:24:01 2021

@author: Adlla Katarine e Daniel Alves
"""
import pandas as pd
import numpy as np
import seaborn as sns


#leitura da base de dados
df = pd.read_csv('./dataset/mergedData/merged_LENCOIS_PRED.csv')

#visualizando a distribuição da amostra
ax = sns.countplot(x="has_Foco", data=df)

#salvando o que será previsto em outra variável
previsao = df['has_Foco'].values

#removendo coluna de previsão
df = df.drop(columns='has_Foco')

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
df = df.drop(columns='Data Medicao')


################################## TRATAMENTO DE DADOS ##################################
################################## DADOS NULOS ##########################################
#chamada da função da classe pre_processamento_meteorologia.py para tratar valores nulos
from pre_processamento_meteorologia import tratamento
tratamento(df)


#valores para realizar a previsão
previsores = df.iloc[:,:].values


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
profile.to_file("report_2011-2020_Smote.html")


################################### ESCALONAMENTO DOS ATRIBUTOS  ###################################
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
previsores = scaler.fit_transform(previsores)


################################### CLASSIFICAÇÃO DA REDE ###################################
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, mean_absolute_error, accuracy_score,classification_report


#dividindo dados em teste e treinamento 
# Usou-se 25%(test_size = 0.25) como quantidade de atributos para teste e o restante para treinamento
previsores_treinamento, previsores_teste, previsao_treinamento, previsao_teste = train_test_split(previsores, previsao, test_size=0.25, random_state=2)


################################### REGRESSÃO LOGÍSTICA #####################################
from sklearn.linear_model import LogisticRegression


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


##################################### ÁRVORE DE DECISÃO ########################################
from sklearn.tree import DecisionTreeClassifier,export_graphviz


#atribuindo a função a uma variável para ser utilizada
clf = DecisionTreeClassifier()

#treinando o modelo com os valores separados para treinamento
clf = clf.fit(previsores_treinamento, previsao_treinamento)

#verificando as features mais importantes para o modelo treinado
clf.feature_importances_

for feature, importancia in zip(df.columns,clf.feature_importances_):
    print("{}:{}".format(feature, importancia))

#realizando previção do dados para 'previsores_teste
resultado = clf.predict(previsores_teste)

#relatório de classificação
print(classification_report(previsao_teste,resultado))

print("acurácia training set: {:.3f}".format(clf.score(previsores_treinamento, previsao_treinamento)))
print("acurácia testing set: {:.3f}".format(clf.score(previsores_teste, previsao_teste)))


##################################### NAIVE BAYES ########################################
print('\n ******************** NAIVE BAYES ********************')
from sklearn.naive_bayes import GaussianNB
classificador = GaussianNB()
classificador.fit(previsores_treinamento, previsao_treinamento)
previsoes = classificador.predict(previsores_teste)

#relatório de classificação
print(classification_report(previsao_teste,previsoes))

matrizNB = confusion_matrix(previsao_teste, previsoes)
print("acurácia training set: {:.3f}".format(classificador.score(previsores_treinamento, previsao_treinamento)))
print("acurácia testing set: {:.3f}".format(classificador.score(previsores_teste, previsao_teste)))


