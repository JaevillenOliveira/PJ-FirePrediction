const dict = {
  BONINAL: "piata",
  ANDARAI: "lencois",
  IBICOARA: "piata",
  IRAMAIA: "itiruçu",
  IRAQUARA: "lencois",
  ITAETE: "lencois",
  LENCOIS: "lencois",
  MUCUGE: "piata",
  "NOVA REDENCAO": "lencois",
  PALMEIRAS: "lencois",
};


export default function(municipio){
  return dict[municipio]
}