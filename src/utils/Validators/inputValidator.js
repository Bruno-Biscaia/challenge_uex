import { cpf as cpfValidator } from 'cpf-cnpj-validator'; 

 // Função para validar CPF utilizando a biblioteca (cpf-valdiator)
 export function isValidCPF(cpf) {
    return cpfValidator.isValid(cpf);
  };
  
  //Funcao para validar email padrao
  export function isValidEmail(email)  {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  //Função para validar telefone
  export function isValidPhone (phone) {
    return /^\d{10,11}$/.test(phone); // Válido para números de 10 ou 11 dígitos
  };

  export const validateCep = async (cep, setCepValid ) => {
    if (cep?.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setCepValid(true);
          return true;
        }
      } catch (error) {
        console.error("Erro ao validar CEP:", error);
      }
    }
    setCepValid(false);
    return false;
  };