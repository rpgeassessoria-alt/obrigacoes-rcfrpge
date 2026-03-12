import { IntegraContadorClient } from '../client';

export class ProcuracoesService {
  /**
   * Consulta o status das procurações eletrônicas do CNPJ na RFB
   */
  static async consultar(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-procuracao/consulta`, // Replace with actual Serpro endpoint
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 86400 // 24 horas
    });
  }
}
