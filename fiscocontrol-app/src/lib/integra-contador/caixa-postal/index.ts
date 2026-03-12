import { IntegraContadorClient } from '../client';

export class CaixaPostalService {
  /**
   * Consulta mensagens não lidas na Caixa Postal da RFB (e-CAC)
   */
  static async consultarMensagens(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-caixa-postal/mensagens`, // Replace with actual Serpro endpoint
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 1800 // 30 minutos
    });
  }
}
