import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private client: BetaAnalyticsDataClient | null = null;

  constructor(private readonly configService: ConfigService) {
    const clientEmail = this.configService.get<string>('GA_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('GA_PRIVATE_KEY');
    if (clientEmail && privateKey) {
      this.client = new BetaAnalyticsDataClient({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
      });
    } else {
      this.logger.warn(
        'GA not configured: set GA_CLIENT_EMAIL and GA_PRIVATE_KEY in .env',
      );
    }
  }

  /**
   * Lấy số visitor đang online (activeUsers – 30 phút qua). Dùng Realtime, không cần dữ liệu lịch sử.
   * GA_PROPERTY_ID phải là **số** (Admin > Cài đặt thuộc tính), KHÔNG phải Measurement ID (G-xxx).
   * Service account (GA_CLIENT_EMAIL) cần được thêm vào GA4 với quyền Xem.
   */
  async getVisitors(): Promise<any> {
    const propertyId = this.configService.get<string>('GA_PROPERTY_ID');
    if (!this.client || !propertyId) {
      if (!propertyId) {
        this.logger.warn(
          'GA_PROPERTY_ID missing in .env — use numeric Property ID from GA4 Admin > Property settings',
        );
      }
      return { visitors: 0 };
    }

    try {
      // const [response] = await this.client.runRealtimeReport({
      //   property: `properties/${propertyId}`,
      //   metrics: [{ name: 'activeUsers' }],
      // });
      
      
      // const [response] = await this.client.runReport({
      //   property: `properties/${propertyId}`,
      //   dateRanges: [{ startDate: '2daysAgo', endDate: 'today' }],
      //   metrics: [{ name: 'totalUsers' }],
      // });

      // const rt = await this.client.runRealtimeReport({
      //   property: `properties/${propertyId}`,
      //   metrics: [{ name: 'activeUsers' }],
      // });
      
      // // Page views (realtime)
      // const pv = await this.client.runRealtimeReport({
      //   property: `properties/${propertyId}`,
      //   metrics: [{ name: 'screenPageViews' }],
      // });
      // console.log('rt',rt)
      // console.log('pv',pv)

      const [rt] = await this.client.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      });
    
      const [pvReport] = await this.client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
          {
            startDate: '2025-01-01', // ngày bạn bắt đầu gắn GA
            endDate: 'today',
          },
        ],
        metrics: [{ name: 'screenPageViews' }],
      });
    
      const onlineUsers = Number(
        rt.rows?.[0]?.metricValues?.[0]?.value ?? 0
      );
    
      const pageViews = Number(
        pvReport.rows?.[0]?.metricValues?.[0]?.value ?? 0
      );

      
      // console.log('response',response)
      // console.log('response.rows?.[0]?.metricValues', response.rows?.[0]?.metricValues);

      // const value = response.rows?.[0]?.metricValues?.[0]?.value;
      return {
        // visitors: value ? parseInt(String(value), 10) : 0,
        onlineUsers,
        pageViews: pageViews,
      };
    } catch (err: any) {
      this.logger.error(
        `Google Analytics API error: ${err?.message ?? err}. Check: GA_PROPERTY_ID is numeric, service account has Viewer role in GA4, and Google Analytics Data API is enabled.`,
      );
      return { visitors: 0 };
    }
  }
}
