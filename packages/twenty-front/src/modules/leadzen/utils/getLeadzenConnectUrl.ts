import { isNonEmptyString } from '@sniptt/guards';

// Locally Connect runs on :8090 beside the CRM; online it sits under the CRM's own domain.
export const getLeadzenConnectUrl = () =>
  isNonEmptyString(window.location.port)
    ? `${window.location.protocol}//${window.location.hostname}:8090`
    : `${window.location.origin}/lz-connect`;
