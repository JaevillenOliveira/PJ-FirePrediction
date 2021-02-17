import pandas as pd
import numpy as np

#Change this variable to your directory path
path = '/home/jaevillen/IEEE/PJ-FirePrediction/'

file_names = [
    path+'Focos_2016-01-01_2016-12-31.csv',
    path+'Focos_2017-01-01_2017-12-31.csv',
    path+'Focos_2018-01-01_2018-12-31.csv',
    path+'Focos_2019-01-01_2019-12-31.csv',
]

# Remove linhas que não foram originadas pelo satélite de referência AQUA_M-T
def selectSatelite():
    for file in file_names:
        focos = pd.read_csv(file)
        print('In file: '+file)
        for index, row in focos.iterrows():       
            if(row['satelite'] != 'AQUA_M-T'):
                print('At Row: '+str(index)+ ' Value: '+str(row['satelite']))
                focos = focos.drop([index], axis=0)
            
        focos.to_csv(file, index=False)    
        
# Remove linhas do Município de Iramaia
def selectCities():
    for file in file_names:
        focos = pd.read_csv(file)
        print('In file: '+file)
        for index, row in focos.iterrows():       
            if(row['municipio'] == 'IRAMAIA'):
                print('At Row: '+str(index)+ ' Value: '+str(row['municipio']))
                focos = focos.drop([index], axis=0)
            
        focos.to_csv(file, index=False) 
        
# Formata a string da data 
    # Remove a hora
    # Troca '/' por '-' na data
def formatDate():
    for file in file_names:
        focos = pd.read_csv(file)
        print('In file: '+file)
        for index, row in focos.iterrows():    
            date = (row['datahora'].split()[0]).replace('/', '-')  
            focos.at[index, 'datahora'] = date
            
        focos.to_csv(file, index=False) 

selectCities()
selectSatelite()
formatDate()
