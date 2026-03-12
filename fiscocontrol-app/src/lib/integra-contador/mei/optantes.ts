import { IntegraContadorClient } from '../client';

export class OptantesMeiService {
  /**
   * Consulta a Situação de Optante/Excluída do Simei
   */
  static async consultarSituacao(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/optante/consulta`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 86400 // 24 horas
    });
  }
}
