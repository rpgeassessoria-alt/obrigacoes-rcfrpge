import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '../../../lib/auth'; // Você deve importar seu authOptions real para proteger a rota 
import { IntegraContadorClient } from '../../../lib/integra-contador/client';

export async function GET(request: Request) {
  // 1. Validar Sessão: Só usuários autenticados no FiscoControl podem acessar
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint'); // Ex: /integra-mei/ccmei
  const cnpj = searchParams.get('cnpj');

  if (!endpoint || !cnpj) {
    return NextResponse.json(
      { error: 'Parâmetros "endpoint" e "cnpj" são obrigatórios' },
      { status: 400 }
    );
  }

  try {
    // 2. Chama a API do Serpro usando o nosso Client Seguro (Server-Side)
    const data = await IntegraContadorClient.request({
      endpoint,
      cnpjConsultado: cnpj,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { message: error.message };
    return NextResponse.json(errorData, { status });
  }
}

export async function POST(request: Request) {
  // Validação de sessão (omitida para foco no Serpro, descomente em produção)
  // const session = await getServerSession(authOptions);
  // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { endpoint, cnpj, data } = body;

    if (!endpoint || !cnpj) {
      return NextResponse.json({ error: 'Parâmetros "endpoint" e "cnpj" faltantes' }, { status: 400 });
    }

    const responseData = await IntegraContadorClient.request({
      endpoint,
      method: 'POST',
      data,
      cnpjConsultado: cnpj,
    });

    return NextResponse.json(responseData);
  } catch (error: any) {
    const status = error.response?.status || 500;
    return NextResponse.json(error.response?.data || { message: error.message }, { status });
  }
}
