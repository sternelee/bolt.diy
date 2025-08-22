import { BaseProviderChecker } from '~/components/@settings/tabs/providers/service-status/base-provider';
import type { StatusCheckResult } from '~/components/@settings/tabs/providers/service-status/types';

export class VercelStatusChecker extends BaseProviderChecker {
  async checkStatus(): Promise<StatusCheckResult> {
    try {
      /*
       * Check API endpoint directly since Vercel is a newer provider
       * and may not have a public status page yet
       */
      const apiEndpoint = 'https://ai-gateway.vercel.sh/v1/ai/models';
      const apiStatus = await this.checkEndpoint(apiEndpoint);

      // Check their website as a secondary indicator
      const websiteStatus = await this.checkEndpoint('https://vercel.com/ai-gateway/models');

      let status: StatusCheckResult['status'] = 'operational';
      let message = 'All systems operational';

      if (apiStatus !== 'reachable' || websiteStatus !== 'reachable') {
        status = apiStatus !== 'reachable' ? 'down' : 'degraded';
        message = apiStatus !== 'reachable' ? 'API appears to be down' : 'Service may be experiencing issues';
      }

      return {
        status,
        message,
        incidents: [], // No public incident tracking available yet
      };
    } catch (error) {
      console.error('Error checking Vercel status:', error);

      return {
        status: 'degraded',
        message: 'Unable to determine service status',
        incidents: ['Note: Limited status information available'],
      };
    }
  }
}
