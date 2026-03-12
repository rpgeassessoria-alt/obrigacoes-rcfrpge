import { IntegraContadorClient } from '../client';

export class AusenciaDeclaracoesMeiService {
  /**
   * Consulta a situação de omissão de declarações (DASN-SIMEI)
   */
  static async consultarAusencia(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/ausencia-declaracoes/consulta`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 86400 // 24 horas
    });
  }
}
