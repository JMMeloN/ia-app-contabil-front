/**
 * Utilitários para máscaras de input
 */

/**
 * Máscara para telefone: (00) 00000-0000 ou (00) 0000-0000
 */
export const phoneMask = (value: string): string => {
  if (!value) return '';

  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  // Aplica a máscara
  if (numbers.length <= 10) {
    // (00) 0000-0000
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // (00) 00000-0000
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }
};

/**
 * Máscara para CNPJ: 00.000.000/0000-00
 */
export const cnpjMask = (value: string): string => {
  if (!value) return '';

  const numbers = value.replace(/\D/g, '');

  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
};

/**
 * Máscara para CEP: 00000-000
 */
export const cepMask = (value: string): string => {
  if (!value) return '';

  const numbers = value.replace(/\D/g, '');

  return numbers
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

/**
 * Máscara para valor monetário: R$ 0.000,00
 */
export const currencyMask = (value: string): string => {
  if (!value) return '';

  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  if (!numbers || numbers === '0') return '';

  // Converte para número e divide por 100 para ter os centavos
  const amount = parseFloat(numbers) / 100;

  // Formata como moeda brasileira
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Remove a máscara de valor monetário e retorna o valor numérico
 */
export const currencyToNumber = (value: string): number => {
  if (!value) return 0;

  // Remove pontos (separadores de milhar) e substitui vírgula por ponto
  const cleanValue = value
    .replace(/\./g, '')
    .replace(',', '.');

  return parseFloat(cleanValue) || 0;
};

/**
 * Formata um número como moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
