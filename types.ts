
export interface BannerInfo {
  id: string;
  site: string;
  htmlSnippet: string;
  detectedButton?: string;
  timestamp: number;
}

export interface AutomationStats {
  totalBypassed: number;
  timeSaved: number;
}
