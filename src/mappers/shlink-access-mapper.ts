import { SHLinkAccessDto } from '@/domain/dtos/shlink-access';
import { SHLinkAccessModel } from '@/domain/models/shlink-access';
import { SHLinkAccessEntity } from '@/entities/shlink-access';

export const mapModelToEntity = (
  shlinkAccessModel?: SHLinkAccessModel,
): SHLinkAccessEntity | undefined => {
  return shlinkAccessModel
    ? {
        access_time: shlinkAccessModel.getAccessTime(),
        recipient: shlinkAccessModel.getRecipient(),
        shlink_id: shlinkAccessModel.getSHLinkId(),
        id: shlinkAccessModel.getId(),
        created_at: shlinkAccessModel.getCreatedAt(),
        updated_at: shlinkAccessModel.getUpdatedAt()
      }
    : undefined;
};

export const mapEntityToModel = (
  shlinkAccessEntity?: SHLinkAccessEntity,
): SHLinkAccessModel | undefined => {
  return shlinkAccessEntity
    ? new SHLinkAccessModel(
        shlinkAccessEntity.shlink_id,
        shlinkAccessEntity.access_time,
        shlinkAccessEntity.recipient,
        shlinkAccessEntity.id,
        shlinkAccessEntity.created_at,
        shlinkAccessEntity.updated_at,
      )
    : undefined;
};

export const mapModelToDto = (
  shlinkAccessModel?: SHLinkAccessModel,
): SHLinkAccessDto | undefined => {
  return shlinkAccessModel
    ? {
        id: shlinkAccessModel.getId(),
        shlinkId: shlinkAccessModel.getSHLinkId(),
        accessTime: shlinkAccessModel.getAccessTime(),
        recipient: shlinkAccessModel.getRecipient(),
        createdAt: shlinkAccessModel.getCreatedAt(),
        updatedAt: shlinkAccessModel.getUpdatedAt()
      }
    : undefined;
};
