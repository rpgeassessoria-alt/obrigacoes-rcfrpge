import { IntegraContadorClient } from '../client';

export class PGMEIService {
  /**
   * Gera o DAS do MEI para uma competência específica
   * @param cnpj CNPJ do MEI
   * @param periodoApuracao Formato MMAAAA ex "012024"
   */
  static async gerarDAS(cnpj: string, periodoApuracao: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/pgmei/das`,
      method: 'POST',
      data: {
        cnpj,
        periodoApuracao
      },
      cnpjConsultado: cnpj
    });
  }
  
  /**
   * Consulta a situação das competências do MEI
   * @param cnpj CNPJ do MEI
   * @param ano Formato AAAA ex "2024"
   */
  static async consultarCompetencias(cnpj: string, ano: string): Promise<any> {
     return IntegraContadorClient.request({
      endpoint: `/integra-mei/pgmei/competencias`,
      method: 'GET',
      params: { cnpj, ano },
      cnpjConsultado: cnpj,
      cacheTTL: 3600 // 1 hora
    });
  }
}
