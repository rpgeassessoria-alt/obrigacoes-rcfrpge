import { IntegraContadorClient } from '../client';

export class DividaAtivaMeiService {
  /**
   * Consulta os débitos em Dívida Ativa do MEI (PGFN)
   */
  static async consultarDivida(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/divida-ativa/consulta`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 14400 // 4 horas
    });
  }

  /**
   * Emite a guia (DAS/DARF) para pagamento da Dívida Ativa
   */
  static async emitirGuia(cnpj: string, numeroInscricao: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/divida-ativa/guia`,
      method: 'POST',
      data: { cnpj, numeroInscricao },
      cnpjConsultado: cnpj
    });
  }
}
