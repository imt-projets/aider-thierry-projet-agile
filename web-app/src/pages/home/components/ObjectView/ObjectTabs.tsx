import { Tabs, Tab, Typography } from '@mui/material';
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
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

interface TabProperties {
	name : string
}

const tabs : TabProperties[] = [
	{ name: "Informations générales" },
	{ name : "Autres onglets"}
]


export const ObjectTabs = () => {
  	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const renderTabs = () => {
		return tabs.map((tab, idx) => (
			<Tab
				key={tab.name}
				label={tab.name}
				sx={{ 
					justifyContent: 'flex-start', 
					alignItems: 'flex-start', 
					textAlign: 'left',     
					color: '#000', 
					'&.Mui-selected': {
					color: '#0957FF',
					}
				}}
				value={idx}
			/>
		))
	}

	return (
		<div id="menu--container">
			<div className="tabs-wrapper">
				<Tabs
					orientation="vertical"
					value={value}
					onChange={handleChange}
					aria-label="Vertical menu tabs"
					className="vertical-tabs"
					sx={{
						'& .MuiTabs-indicator': {
						backgroundColor: '#0957FF',
						}
					}}
				>
					{renderTabs()}
				</Tabs>
			</div>
			<button className="export-btn">
				Export Excel
			</button>
		</div>
	);
};