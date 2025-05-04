import { Service } from "typedi";
import { Event } from "../models/event";
import { SearchEventsDto } from "src/api/dtos/searchEvent.dto";
import { PaginateResult } from "mongoose";


@Service()
export class EventRepository {
  async getById(id: string): Promise<Event> {
    const event = await Event.findOne({ eventId: id }, { _id: false }).lean();

    if (!event) {
      throw {
        status: 404,
        message: "Event not found"
      };
    }

    return event;
  }

  async search(queryParams: SearchEventsDto): Promise<PaginateResult<Event>> {
    const query: Record<string, any> = {};
    const { page, limit, sort, country, date, homeTeam, awayTeam, team } = queryParams;

    if (country) {
      const escapedCountry = country.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      query.country = { $regex: new RegExp(escapedCountry, 'i') };
    }

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(searchDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (homeTeam) {
      const escapedTeam = homeTeam.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      query.homeTeam = { $regex: new RegExp(escapedTeam, 'i') };
    }

    if (awayTeam) {
      const escapedTeam = awayTeam.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      query.awayTeam = { $regex: new RegExp(escapedTeam, 'i') };
    }

    if (team) {
      const escapedTeam = team.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const teamRegex = new RegExp(escapedTeam, 'i');
      query.$or = [
        { homeTeam: { $regex: teamRegex } },
        { awayTeam: { $regex: teamRegex } }
      ];
    }

    const options = {
      page,
      limit,
      lean: true,
      sort,
      select: {
        _id: false,
      },
      customLabels: {
        docs: 'items',
        totalDocs: 'totalItems'
      },
    }

    try {
      return await Event.paginate(query, options);
    } catch (error) {
      console.error("Error in event search:", error);
      throw {
        status: 500,
        message: "Internal server error while searching events"
      };
    }
  }
}