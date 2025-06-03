import * as React from 'react';
import { Tabs, Tab, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="tab-panel">
          <Typography>{children}</Typography>
        </div>
      )}
    </div>
  );
}

export const MenuView = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div id="menu--container">
      <div className="tabs-wrapper">
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Vertical menu tabs"
          className="vertical-tabs"
        >
          <Tab label="Informations générales" />
          <Tab label="Autres informations" />
          <Tab label="Autres onglets" />
        </Tabs>
      </div>
      <button className="export-btn">
        Export Excel
      </button>
    </div>
  );
};