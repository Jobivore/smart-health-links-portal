import { SHLinkDto, SHLinkMiniDto } from "@/domain/dtos/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { mapEntityToModel, mapModelToEntity, mapModelToDto, mapDtoToModel, mapModelToMiniDto } from "@/mappers/shlink-mapper";
import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEndpointModel } from "@/domain/models/shlink-endpoint";
import { EXTERNAL_URL } from "@/app/constants/http-constants";

describe("SHLink Mappers", () => {
  const shLinkEntity: SHLinkEntity = {
    id: "1",
    user_id: "1234567890",
    passcode_failures_remaining: 3,
    active: true,
    management_token: "tokenxyz123",
    config_passcode: "passcodeabc",
    config_exp: new Date("2024-01-01T00:00:00Z"),
  };

  const shLinkModel = new SHLinkModel(
    "1234567890",
    3,
    true,
    "tokenxyz123",
    "passcodeabc",
    new Date("2024-01-01T00:00:00Z"),
    "1"
  );

  const shLinkDto: SHLinkDto = {
    id: "1",
    userId: "1234567890",
    passcodeFailuresRemaining: 3,
    active: true,
    managementToken: "tokenxyz123",
    configPasscode: "passcodeabc",
    configExp: new Date("2024-01-01T00:00:00Z"),
  };

  describe("mapEntityToModel", () => {
    it("should map a SHLinkEntity to a SHLinkModel", () => {
      const result = mapEntityToModel(shLinkEntity);
      expect(result).toBeInstanceOf(SHLinkModel);
      expect(result?.getId()).toBe(shLinkEntity.id);
      expect(result?.getUserId()).toBe(shLinkEntity.user_id);
      expect(result?.getPasscodeFailuresRemaining()).toBe(shLinkEntity.passcode_failures_remaining);
      expect(result?.getActive()).toBe(shLinkEntity.active);
      expect(result?.getManagementToken()).toBe(shLinkEntity.management_token);
      expect(result?.getConfigPasscode()).toBe(shLinkEntity.config_passcode);
      expect(result?.getConfigExp()).toBe(shLinkEntity.config_exp);
    });

    it("should return undefined if SHLinkEntity is undefined", () => {
      const result = mapEntityToModel(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapModelToEntity", () => {
    it("should map a SHLinkModel to a SHLinkEntity", () => {
      const result = mapModelToEntity(shLinkModel);
      expect(result).toEqual({
        id: shLinkModel.getId(),
        user_id: shLinkModel.getUserId(),
        passcode_failures_remaining: shLinkModel.getPasscodeFailuresRemaining(),
        active: shLinkModel.getActive(),
        management_token: shLinkModel.getManagementToken(),
        config_passcode: shLinkModel.getConfigPasscode(),
        config_exp: shLinkModel.getConfigExp(),
      });
    });

    it("should return undefined if SHLinkModel is undefined", () => {
      const result = mapModelToEntity(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapModelToDto", () => {
    it("should map a SHLinkModel to a SHLinkDto", () => {
      const result = mapModelToDto(shLinkModel);
      expect(result).toEqual({
        id: shLinkModel.getId(),
        userId: shLinkModel.getUserId(),
        passcodeFailuresRemaining: shLinkModel.getPasscodeFailuresRemaining(),
        active: shLinkModel.getActive(),
        managementToken: shLinkModel.getManagementToken(),
        configPasscode: shLinkModel.getConfigPasscode(),
        configExp: shLinkModel.getConfigExp(),
      });
    });

    it("should return undefined if SHLinkModel is undefined", () => {
      const result = mapModelToDto(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapDtoToModel", () => {
    it("should map a SHLinkDto to a SHLinkModel", () => {
      const result = mapDtoToModel(shLinkDto);
      expect(result).toBeInstanceOf(SHLinkModel);
      expect(result?.getId()).toBe(shLinkDto.id);
      expect(result?.getUserId()).toBe(shLinkDto.userId);
      expect(result?.getPasscodeFailuresRemaining()).toBe(shLinkDto.passcodeFailuresRemaining);
      expect(result?.getActive()).toBe(shLinkDto.active);
      expect(result?.getManagementToken()).toBe(shLinkDto.managementToken);
      expect(result?.getConfigPasscode()).toBe(shLinkDto.configPasscode);
      expect(result?.getConfigExp()).toEqual(shLinkDto.configExp);
    });

    it("should return undefined if SHLinkDto is undefined", () => {
      const result = mapDtoToModel(undefined);
      expect(result).toBeUndefined();
    });
  });
});

describe('mapModelToMiniDto', () => {
  it('should return correct SHLinkMiniDto when provided valid SHLinkModel and files', () => {
    // Create a valid SHLinkModel instance
    const shlinkModel = new SHLinkModel(
      'unique-user-id',
      5,
      true,
      'management-token',
      'config-passcode',
      new Date(Date.now() + 10000), // future date
      'link-id'
    );

    // Create valid SHLinkEndpointModel instances
    const endpoint1 = new SHLinkEndpointModel('shlink-id-1', 'server-config-id-1', 'url-path-1', 'endpoint1-id');
    const endpoint2 = new SHLinkEndpointModel('shlink-id-2', 'server-config-id-2', 'url-path-2', 'endpoint2-id');
    const files = [endpoint1, endpoint2];
    const ticket = 'sample-ticket';

    // Execute the function
    const result = mapModelToMiniDto(shlinkModel, files, ticket);

    // Assert the expected result
    expect(result).toEqual({
      id: 'link-id',
      managementToken: 'management-token',
      files: [
        {
          location: `${EXTERNAL_URL}/api/v1/share-links/link-id/endpoints/endpoint1-id?ticket=${ticket}`,
          contentType: 'application/smart-api-access',
          embedded: null
        },
        {
          location: `${EXTERNAL_URL}/api/v1/share-links/link-id/endpoints/endpoint2-id?ticket=${ticket}`,
          contentType: 'application/smart-api-access',
          embedded: null
        }
      ]
    });
  });

  it('should return correct SHLinkMiniDto with no files', () => {
    // Create a valid SHLinkModel instance
    const shlinkModel = new SHLinkModel(
      'unique-user-id',
      5,
      true,
      'management-token',
      'config-passcode',
      new Date(Date.now() + 10000), // future date
      'link-id'
    );

    // Execute the function
    const result = mapModelToMiniDto(shlinkModel);

    // Assert the expected result
    expect(result).toEqual({
      id: 'link-id',
      managementToken: 'management-token',
      files: undefined
    });
  });

  it('should return undefined if no SHLinkModel is provided', () => {
    // Execute the function with undefined SHLinkModel
    const result = mapModelToMiniDto(undefined as unknown as SHLinkModel);

    // Assert the result is undefined
    expect(result).toBeUndefined();
  });

  it('should return correct SHLinkMiniDto when ticket is not provided', () => {
    // Create a valid SHLinkModel instance
    const shlinkModel = new SHLinkModel(
      'unique-user-id',
      5,
      true,
      'management-token',
      'config-passcode',
      new Date(Date.now() + 10000), // future date
      'link-id'
    );

    // Create a valid SHLinkEndpointModel instance
    const endpoint = new SHLinkEndpointModel('shlink-id', 'server-config-id', 'url-path', 'endpoint-id');
    const files = [endpoint];

    // Execute the function without a ticket
    const result = mapModelToMiniDto(shlinkModel, files);

    // Assert the expected result
    expect(result).toEqual({
      id: 'link-id',
      managementToken: 'management-token',
      files: [
        {
          location: `${EXTERNAL_URL}/api/v1/share-links/link-id/endpoints/endpoint-id?ticket=undefined`,
          contentType: 'application/smart-api-access',
          embedded: null
        }
      ]
    });
  });
});
