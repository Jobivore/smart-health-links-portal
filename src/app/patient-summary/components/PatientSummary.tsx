'use client';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from './TabPanel';
import { ElementType, useState } from 'react';
import Patient from './resources/Patient/Patient';
import { extractResourceInfo } from '@/app/utils/helpers';
import Organization from './resources/Organization/Organization';
import Condition from './resources/Condition/Condition';
import { IResourceType, TBundle } from '../types/fhir.types';

const COMPONENT_MAP: Partial<Record<keyof IResourceType, ElementType>> = {
  Patient,
  Organization,
  Condition,
};

export default function PatientSummary({
  fhirBundle,
}: {
  fhirBundle: TBundle;
}) {
  const dataTabs: string[] = Array.from(
    new Set(fhirBundle.entry.map((entry) => entry.resource.resourceType)),
  );
  const [selectedTab, setSelectedTab] = useState(String(dataTabs[0]));
  const renderPanels = () =>
    dataTabs.map((resourceType: keyof IResourceType) => {
      const DynamicComponent = COMPONENT_MAP[resourceType];
      const resourceInfo = extractResourceInfo(resourceType, fhirBundle);
      return (
        <TabPanel value={resourceType} index={selectedTab} key={resourceType}>
          {DynamicComponent && <DynamicComponent data={resourceInfo} />}
        </TabPanel>
      );
    });
  const renderTabs = () =>
    dataTabs.map((resourceType) => (
      <Tab label={resourceType} key={resourceType} value={resourceType} />
    ));
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {renderTabs()}
        </Tabs>
      </Box>
      {renderPanels()}
    </Box>
  );
}
