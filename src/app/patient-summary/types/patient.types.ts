type Identifier = {
  use?: "usual" | "official" | "temp" | "secondary" | "old";
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Organization;
};

type HumanName = {
  use?:
    | "usual"
    | "official"
    | "temp"
    | "nickname"
    | "anonymous"
    | "old"
    | "maiden"; // Name use
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
};

type ContactPoint = {
  system?: "phone" | "fax" | "email" | "pager" | "url" | "sms" | "other";
  value?: string;
  use?: "home" | "work" | "temp" | "old" | "mobile";
  rank?: number;
  period?: Period;
};

type Address = {
  use?: "home" | "work" | "temp" | "old" | "billing";
  type?: "postal" | "physical" | "both";
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: Period;
};

type Coding = {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
};

type CodeableConcept = { coding?: Coding[]; text?: string };

type Period = { start?: string; end: string };

type PatientContact = {
  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: "male" | "female" | "other" | "unknown";
  organization?: Organization;
  period?: Period;
};

type PatientCommunication = {
  language: CodeableConcept;
  preferred?: boolean;
};

type PatientLink = {
  other: Patient;
  type: "replaced-by" | "replaces" | "refer" | "seealso";
};

//TODO:Complete the type definitions
type Organization = {};

type Attachment = {};

type PractitionerRole = {};

type Practitioner = {};

export type Patient = {
  id?: string;
  meta?: {};
  implicitRules?: string;
  language?: string;
  text?: {};
  contained?: any[];
  extension?: any[];
  modifierExtension?: any[];
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: "male" | "female" | "other" | "unknown";
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: Address[];
  maritalStatus?: CodeableConcept;
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: number;
  photo?: Attachment[];
  contact?: PatientContact[];
  communication?: PatientCommunication[];
  generalPractitioner?: (Organization | Practitioner | PractitionerRole)[];
  managingOrganization?: Organization;
  link?: PatientLink[];
};
