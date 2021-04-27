export const rowFormat = (has_Foco, row, outputFileName) => {
  let [, mes, dia] = row['Data Medicao'].split('-');

  if (outputFileName.includes('_PRED')) {
    return JSON.stringify({
      'Data Medicao': `${dia}/${mes}`,
      'PRECIPITACAO TOTAL; DIARIO (AUT)(mm)':
        row['PRECIPITACAO TOTAL; DIARIO (AUT)(mm)'],
      'TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)':
        row['TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)'],
      'UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)':
        row['UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)'],
      has_Foco: has_Foco ? 1 : 0,
    });
  } else if (outputFileName.includes('_CONVENCIONAL')) {
    return JSON.stringify({
      'Data Medicao': `${dia}/${mes}`,
      'INSOLACAO TOTAL; DIARIO(h)': row['INSOLACAO TOTAL; DIARIO(h)'],
      'PRECIPITACAO TOTAL; DIARIO(mm)': row['PRECIPITACAO TOTAL; DIARIO(mm)'],
      'TEMPERATURA MEDIA COMPENSADA; DIARIA(°C)':
        row['TEMPERATURA MEDIA COMPENSADA; DIARIA(°C)'],
      'UMIDADE RELATIVA DO AR; MEDIA DIARIA(%)':
        row['UMIDADE RELATIVA DO AR; MEDIA DIARIA(%)'],
      'VENTO; VELOCIDADE MEDIA DIARIA(m/s)':
        row['VENTO; VELOCIDADE MEDIA DIARIA(m/s)'],
      has_Foco: has_Foco ? 1 : 0,
    });
  } else if (outputFileName.includes('_COMVENTO_AUTO')) {
    return JSON.stringify({
      'Data Medicao': `${dia}/${mes}`,
      'PRECIPITACAO TOTAL; DIARIO (AUT)(mm)':
        row['PRECIPITACAO TOTAL; DIARIO (AUT)(mm)'],
      'TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)':
        row['TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)'],
      'UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)':
        row['UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)'],
      'VENTO; VELOCIDADE MEDIA DIARIA (AUT)(m/s)':
        row['VENTO; VELOCIDADE MEDIA DIARIA (AUT)(m/s)'],
      has_Foco: has_Foco ? 1 : 0,
    });
  }
};
