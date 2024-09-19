import { unstable_noStore } from 'next/cache';
import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import {
  container,
  ServerConfigRepositoryToken,
  SHLinkEndpointRepositoryToken,
  SHLinkRepositoryToken,
} from '@/container';
import {
  CreateSHLinkEndpointDto,
  SHLinkEndpointDto,
} from '@/domain/dtos/shlink-endpoint';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { ISHLinkEndpointRepository } from '@/infrastructure/repositories/interfaces/shlink-endpoint-repository';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { LogHandler } from '@/lib/logger';
import {
  mapDtoToModel,
  mapModelToDto as mapModelToDtoEndpoint,
} from '@/mappers/shlink-endpoint-mapper';
import { mapModelToDto as mapShlinkModelToDto } from '@/mappers/shlink-mapper';
import { getServerConfigsUseCase } from '@/usecases/server-configs/get-server-configs';
import { addEndpointUseCase } from '@/usecases/shlink-endpoint/add-endpoint';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

export const dynamic = 'force-dynamic';

const shlRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);
const shlEndpointRepo = container.get<ISHLinkEndpointRepository>(
  SHLinkEndpointRepositoryToken,
);
const serverConfigRepo = container.get<IServerConfigRepository>(
  ServerConfigRepositoryToken,
);

const logger = new LogHandler(__dirname);

/**
 * @swagger
 * /api/v1/share-links/{id}/endpoints:
 *   post:
 *     tags: [Share Link Endpoints]
 *     description: Create a share link endpoint.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the share link's unique identifier.
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CreateSHLinkEndpoint'
 *     responses:
 *       200:
 *         description: Get Share Link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SHLinkEndpoint'
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  let dto: CreateSHLinkEndpointDto = await request.json();
  logger.info(
    `Creating a share link endpoint with parameters: ${JSON.stringify(dto)}`,
  );

  try {
    unstable_noStore();
    const serverConfig = (
      await getServerConfigsUseCase({ repo: serverConfigRepo })
    )[0];

    const shl = await getSingleSHLinkUseCase(
      { repo: shlRepo },
      { id: params.id, managementToken: dto.managementToken },
    );

    if (!shl || !serverConfig) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    }

    const shlinkData = mapShlinkModelToDto(shl);
    dto.serverConfigId = serverConfig.getId();
    dto.shlinkId = shlinkData.id;

    const endpoint = mapDtoToModel(dto as SHLinkEndpointDto);
    const endpointResult = await addEndpointUseCase(
      { repo: shlEndpointRepo },
      { endpoint: endpoint },
    );

    return NextResponse.json(mapModelToDtoEndpoint(endpointResult), {
      status: 200,
    });
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}
