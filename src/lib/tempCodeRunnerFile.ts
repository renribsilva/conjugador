nst test = async () => {
  const resultado = await findPropsOfVerb("propor", true, "propor");
  console.log(resultado); // Exibe o resultado ou null se não encontrar
};
test();