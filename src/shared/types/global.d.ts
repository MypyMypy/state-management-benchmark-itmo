declare module '*.module.css';

interface WebVitalMetric {
	name: string;
	value: number;
	rating?: string;
	id?: string;
	navigationType?: string;
	delta?: number;
}

interface Window {
	__vitals?: WebVitalMetric[];
}