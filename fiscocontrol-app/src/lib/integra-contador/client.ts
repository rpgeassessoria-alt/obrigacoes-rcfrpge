import axios, { AxiosError } from "axios";
import { IntegraContadorAuth } from "./auth";
import { prisma } from "../prisma";

// Instância base do Axios apontando para a API do Serpro
const serproApi = axios.create({
  baseURL: process.env.SERPRO_API_BASE_URL,
  timeout: 30000, 
});

// Request Interceptor: Injeta o Token OAuth
serproApi.interceptors.request.use(async (config) => {
  try {
    const token = await IntegraContadorAuth.getAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Endpoint Client
export class IntegraContadorClient {
  
  /**
   * Método genérico para fazer requisições à API do Serpro
   * Trata cache e logging (auditoria)
   */
  static async request<T>({
    endpoint,
    method = "GET",
    params = {},
    data = null,
    cnpjConsultado, // Para fins de auditoria/log
    cacheTTL = 0, // Segundos para manter no cache (0 = sem cache)
  }: {
    endpoint: string;
    method?: "GET" | "POST" | "PUT";
    params?: Record<string, any>;
    data?: any;
    cnpjConsultado: string;
    cacheTTL?: number;
  }): Promise<T> {
    const startTime = Date.now();

    // 1. Tentar recuperar do Cache (apenas para GET)
    let cacheKey = "";
    if (method === "GET" && cacheTTL > 0) {
      cacheKey = `${endpoint}_${cnpjConsultado}_${JSON.stringify(params)}`;
      try {
        const cached = await prisma.integraCache.findUnique({
          where: { cacheKey },
        });

        if (cached) {
          if (new Date() < cached.expiresAt) {
            console.log(`[CACHE HIT] ${cacheKey} (Expira em: ${cached.expiresAt.toISOString()})`);
            return JSON.parse(cached.data) as T;
          } else {
             // Limpar cache expirado
             await prisma.integraCache.delete({ where: { cacheKey } });
             console.log(`[CACHE EXPIRED] ${cacheKey}`);
          }
        }
      } catch (cacheError) {
        console.error("Erro ao ler cache:", cacheError);
      }
    }

    // 2. Requisição Real
    try {
      const response = await serproApi({
        url: endpoint,
        method,
        params,
        data,
      });

      // Salvar log de auditoria no Prisma
      await this.logRequest(endpoint, cnpjConsultado, response.status, response.data);

      // 3. Salvar no Cache se aplicável
      if (method === "GET" && cacheTTL > 0 && cacheKey) {
        try {
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + cacheTTL);
          
          await prisma.integraCache.upsert({
            where: { cacheKey },
            update: {
              data: JSON.stringify(response.data),
              expiresAt,
            },
            create: {
              cacheKey,
              data: JSON.stringify(response.data),
              expiresAt,
            },
          });
          console.log(`[CACHE SET] ${cacheKey} (Expira em: ${expiresAt.toISOString()})`);
        } catch (saveCacheError) {
           console.error("Erro ao salvar cache:", saveCacheError);
        }
      }

      return response.data;
    } catch (error: any) {
      const err = error as AxiosError;
      const status = err.response?.status || 500;
      const responseData = err.response?.data || { message: err.message };

      // Salvar log de erro
      await this.logRequest(endpoint, cnpjConsultado, status, responseData);

      console.error(`Erro API Serpro [${endpoint}]:`, status, responseData);
      throw error;
    }
  }

  // --- Serviço de Log Auxiliar ---
  private static async logRequest(
    endpoint: string,
    cnpj: string,
    status: number,
    response: any
  ) {
    try {
      // Stringificando apenas os 2000 primeiros caracteres para logs caso a res for muito gigante (Muitas certidões vêm em PDF base64 grande, evitamos logar pdf)
      const resString = JSON.stringify(response);
      const safeResponse = resString.length > 2000 ? resString.substring(0, 2000) + '...[truncated]' : resString;

      await prisma.integraLog.create({
        data: {
          endpoint,
          cnpj,
          status,
          response: safeResponse,
        },
      });
    } catch (e) {
      console.error("Falha ao salvar IntegraLog no banco de dados", e);
    }
  }
}
