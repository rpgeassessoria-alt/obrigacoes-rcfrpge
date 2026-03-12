import { NextResponse } from 'next/server';
import { CNDFGTSService } from '../../../../../lib/integra-contador/certidoes/cnd-fgts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');

  if (!cnpj) {
    return NextResponse.json({ error: 'CNPJ é obrigatório' }, { status: 400 });
  }

  try {
    const data = await CNDFGTSService.consultar(cnpj);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
