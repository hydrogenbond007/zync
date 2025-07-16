// Using types compatible with Origin SDK
export interface LicenseTerms {
  price: bigint;
  duration: number;
  royaltyBps: number;
  paymentToken: string; // Address type
}

export interface IIpAsset {
  id: string;
  title: string;
  description: string;
  creator: string;
  contentHash: string;
  tokenURI: string;
  license: LicenseTerms;
  createdAt: string;
} 