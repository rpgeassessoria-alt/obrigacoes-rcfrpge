import { NextResponse } from 'next/server';
import { DctfwebService } from '../../../../../lib/integra-contador/declaracoes/dctfweb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');
  const periodo = searchParams.get('periodo'); // formato YYYYMM

  if (!cnpj || !periodo) {
    return NextResponse.json({ error: 'CNPJ e período são obrigatórios' }, { status: 400 });
  }

  try {
    const data = await DctfwebService.consultar(cnpj, periodo);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
