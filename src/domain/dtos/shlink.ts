
export class CreateSHLinkDto {
    userId: string;
    configPasscode?: string;
    configExp?: Date;
}

export class SHLinkFileDto {
    contentType: string;
    embedded?: string;
    location: string;
}

export class SHLinkDto extends CreateSHLinkDto{
    id: string;
    passcodeFailuresRemaining: number;
    active: boolean;
    managementToken: string;
}

export class SHLinkMiniDto {
    id: string;
    managementToken: string;
    files?: SHLinkFileDto[];
    expiryDate?: Date;
}

export class SHLinkRequestDto {
    managementToken: string;
    recipient: string;
    passcode?: string;
}

export class SHLinkUpdateDto {
    id: string;
    managementToken: string;
    oldPasscode: string;
    passcode?: string;
    expiryDate?: Date;
}