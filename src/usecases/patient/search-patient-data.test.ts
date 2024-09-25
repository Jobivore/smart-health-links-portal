import { getUserProfile } from '@/app/utils/authentication';
import { ServerConfigModel } from '@/domain/models/server-config';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import {
  IHapiFhirService,
  FhirSearchResult,
  FhirPatient,
} from '@/services/hapi-fhir.interface';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';

import { searchPatientUseCase } from './search-patient';

// Mock the HapiFhirServiceFactory and IServerConfigRepository
jest.mock('@/app/utils/authentication', () => ({
  getUserProfile: jest.fn(),
}));
jest.mock('@/services/hapi-fhir-factory');
jest.mock('@/infrastructure/repositories/interfaces/server-config-repository');

describe('searchPatientUseCase', () => {
  let mockRepo: jest.Mocked<IServerConfigRepository>;
  let mockService: jest.Mocked<IHapiFhirService>;
  const email = 'test@email.com';

  (getUserProfile as jest.Mock).mockResolvedValue(true);

  beforeEach(() => {
    mockRepo = {
      findMany: jest.fn(),
    } as any;

    mockService = {
      searchPatient: jest.fn(),
    } as any;

    HapiFhirServiceFactory.getService = jest.fn().mockReturnValue(mockService);
  });

  it('should return patient and server config data if patient data is found', async () => {
    const patientId = '12345';
    const expectedId = 'patient-12345';
    const data = {
      resource: {
        id: expectedId,
        telecom: [{ system: 'email', value: email }],
      },
    };
    const serverConfig = { endpoint_url: 'http://test.com', config_key: 'key' };
    const expectedConfig = new ServerConfigModel('key', 'http://test.com');

    // Mock service configuration
    mockRepo.findMany.mockResolvedValue([serverConfig]);

    // Mock patient search result
    mockService.searchPatient.mockResolvedValue({
      entry: [data],
    });

    const result = await searchPatientUseCase(
      { repo: mockRepo },
      { patientId, email },
    );

    expect(result.patient).toEqual({ ...data.resource });
    expect(mockService.searchPatient).toHaveBeenCalledWith(patientId);
  });

  it('should throw an error if configuration is missing', async () => {
    mockRepo.findMany.mockResolvedValue([]);

    await expect(
      searchPatientUseCase({ repo: mockRepo }, { patientId: '12345', email }),
    ).rejects.toThrow(new ExternalDataFetchError('Missing Config error.'));
  });

  it('should throw an error if patient data is not found', async () => {
    const patientId = '12345';

    // Mock service configuration
    mockRepo.findMany.mockResolvedValue([{ endpoint_url: 'http://test.com' }]);

    // Mock empty patient search result
    mockService.searchPatient.mockResolvedValue({
      entry: [],
    } as FhirSearchResult<FhirPatient>);

    await expect(
      searchPatientUseCase({ repo: mockRepo }, { patientId, email }),
    ).rejects.toThrow(
      new ExternalDataFetchError('Patient Data not found.', 404),
    );
  });
});
