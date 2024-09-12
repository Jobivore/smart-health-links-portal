import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

import {
  INVALID_SHLINK_CREDS,
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { container, SHLinkEndpointRepositoryToken, SHLinkRepositoryToken } from '@/container';
import { SHLinkQRCodeRequestDto } from '@/domain/dtos/shlink-qrcode';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { encodeSHLink } from '@/mappers/shlink-mapper';
import { getSHLinkQRCodeUseCase } from '@/usecases/shlink-qrcode/get-shlink-qrcode';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

const shlinkRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);


/**
 * @swagger
 * /api/v1/shlinks/{id}/qrcode:
 *   post:
 *     tags: [Share Link QR Code]
 *     description: Get Share link QR Code as an image.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the share link's unique identifier.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SHLinkQRCodeRequest'
 *     responses:
 *       200:
 *         description: A PNG image of the share link's QR code.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */

export async function POST(request: Request, { params }: {params: { id: string } }) {
    
  try {
    const requestDto: SHLinkQRCodeRequestDto = await request.json();
    const { id } = params;

    let shlink = await getSingleSHLinkUseCase(
      {repo: shlinkRepo},
      {id: id, managementToken: requestDto.managementToken},
    );
    if (!shlink)
      return NextResponse.json({message: NOT_FOUND}, {status: 404});

    const imageBuffer = await getSHLinkQRCodeUseCase(shlink);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
      }
    });

  } catch (error) {
    return handleApiValidationError(error);
  }
}
