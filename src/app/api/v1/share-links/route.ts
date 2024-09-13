import { NextResponse } from 'next/server';

import { getUserProfile, validateUser } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { Logger } from '@/app/utils/logger';
import { container, SHLinkRepositoryToken } from '@/container';
import { CreateSHLinkDto, SHLinkDto } from '@/domain/dtos/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import {
  mapDtoToModel,
  mapModelToDto,
  mapModelToMiniDto,
} from '@/mappers/shlink-mapper';
import { addShlinkUseCase } from '@/usecases/shlinks/add-shlink';
import { getSHLinkUseCase } from '@/usecases/shlinks/get-shlink';

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

const route = "api/v1/share-links/"
const logger = new Logger(route)
/**
 * @swagger
 * /api/v1/share-links:
 *   post:
 *     tags: [Share Links]
 *     description: Create a server config.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CreateSHLink'
 *     responses:
 *       200:
 *         description: Create Server Config
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SHLink'
 */
export async function POST(request: Request) {
  logger.log('Creating a share link API');
  try {
    const dto: CreateSHLinkDto = await request.json();
    await validateUser(request, dto.userId);
    const model = mapDtoToModel(dto as SHLinkDto);
    const newShlink = await addShlinkUseCase({ repo }, { shlink: model });
    return NextResponse.json(mapModelToDto(newShlink), { status: 200 });
  } catch (error) {
    return handleApiValidationError(error, route);
  }
}

/**
 * @swagger
 * /api/v1/share-links:
 *   get:
 *     tags: [Share Links]
 *     description: Get share links.
 *     responses:
 *       200:
 *         description: Gets all the signed in user's share links.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SHLinkMini'
 */
export async function GET(request: Request) {
  logger.log('Getting all share links by user');
  try {
    const { id } = await getUserProfile(request);

    const newShlink = await getSHLinkUseCase({ repo }, { user_id: id });
    return NextResponse.json(
      newShlink.map((shlink) => mapModelToMiniDto(shlink)),
      { status: 200 },
    );
  } catch (error) {
    return handleApiValidationError(error, route);
  }
}
