import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async list(request: Request, response: Response): Promise<Response> {
        const { provider_id } = request.params;
        const { month, year } = request.body;

        const listProviderAvailabilityService = container.resolve(
            ListProviderMonthAvailabilityService,
        );
        const availability = await listProviderAvailabilityService.execute({
            provider_id,
            month,
            year,
        });

        return response.json(availability);
    }
}
