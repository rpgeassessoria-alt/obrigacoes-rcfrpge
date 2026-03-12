import axios from 'axios';
import { prisma } from '../prisma'; // Import from existing prisma client

// Definição do token do Serpro
interface SerproTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export class IntegraContadorAuth {
  /**
   * Obtém o token atual, se válido, ou solicita um novo via OAuth 2.0
   */
  static async getAccessToken(): Promise<string> {
    // 1. Verificar se existe token válido no banco de dados (Prisma)
    const activeToken = await prisma.serproToken.findFirst({
      where: {
        expiresAt: {
          gt: new Date() // Expiração maior que agora
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (activeToken) {
      return activeToken.accessToken;
    }

    // 2. Se não existe ou expirou, vamos buscar um novo
    return await this.generateNewToken();
  }

  /**
   * Gera um novo token chamando a API de auth do Serpro
   */
  private static async generateNewToken(): Promise<string> {
    const consumerKey = process.env.SERPRO_CONSUMER_KEY;
    const consumerSecret = process.env.SERPRO_CONSUMER_SECRET;
    const authUrl = process.env.SERPRO_AUTH_URL;

    if (!consumerKey || !consumerSecret || !authUrl) {
      throw new Error("Integra Contador: Credenciais não configuradas no .env.local");
    }

    // O Serpro exige Basic Auth com as credenciais em base64
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
      const response = await axios.post<SerproTokenResponse>(
        authUrl,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const data = response.data;
      
      // Calcular data de expiração (diminuindo 5 minutos por segurança)
      const expiresInSeconds = data.expires_in - 300; 
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

      // Salvar no banco
      await prisma.serproToken.create({
        data: {
          accessToken: data.access_token,
          expiresAt: expiresAt,
          scope: data.scope,
        }
      });

      return data.access_token;
      
    } catch (error: any) {
      console.error("❌ Erro ao obter token do Integra Contador:", error.response?.data || error.message);
      throw new Error("Falha na autenticação com a API do Serpro (Integra Contador)");
    }
  }
}
