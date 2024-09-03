
import { handleApiValidationError } from "@/app/utils/error-handler";
import { CreateSHLinkEndpointDto,SHLinkEndpointDto } from "@/domain/dtos/shlink-endpoint";
import prisma from "@/infrastructure/clients/prisma";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import {  mapModelToDto as mapModelToDtoShlinkMapper } from "@/mappers/shlink-mapper";
import { mapDtoToModel, mapModelToDto as mapModelToDtoEndpoint} from "@/mappers/shlink-endpoint-mapper"
import { NextResponse } from "next/server";
import { NOT_FOUND } from "@/app/constants/http-constants";
import { SHLinkEndpointPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-endpoint-repository";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";
import { addEndpointUseCase } from "@/usecases/shlink-endpoint/add-endpoint";
import { ServerConfigPrismaRepository } from "@/infrastructure/repositories/prisma/server-config-repository";
import { getServerConfigsUseCase } from "@/usecases/server-configs/get-server-configs";

const shlRepo = new SHLinkPrismaRepository(prisma);
const shlEndpointRepo = new SHLinkEndpointPrismaRepository(prisma);
const serverConfigRepo = new ServerConfigPrismaRepository(prisma);

  export async function POST(request: Request, { params }: { params: { id: string } }) {
    let dto:CreateSHLinkEndpointDto = await request.json();

    try{
        const serverConfig = (await getServerConfigsUseCase({repo:serverConfigRepo}))[0];

        const shl = await getSingleSHLinkUseCase({repo:shlRepo}, {id: params.id, managementToken:dto.managementToken});

        if(!shl || !serverConfig){
            return NextResponse.json({message: NOT_FOUND}, { status: 404});
        }
        
        const shlinkData = mapModelToDtoShlinkMapper(shl);
        dto.serverConfigId = serverConfig.getId();
        dto.shlinkId = shlinkData.id
        const endpoint = mapDtoToModel(dto as SHLinkEndpointDto);
        const endpointResult = await addEndpointUseCase({repo:shlEndpointRepo}, {endpoint:endpoint});
        
        return NextResponse.json(mapModelToDtoEndpoint(endpointResult), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}