// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  commitDate,
  commitID,
  nombreRama,
  serviceName,
  versionNumber,
} from '@/utils'
import { NextResponse } from 'next/server'
import { Constantes } from '@/config/Constantes'

export async function GET() {
  return NextResponse.json({
    servicio: serviceName(),
    version: versionNumber(),
    entorno: Constantes.appEnv,
    estado: `Servicio funcionando correctamente 🙌`,
    hora: new Date().getTime(),
    b: await nombreRama(),
    cid: await commitID(),
    cd: await commitDate(),
  })
}
