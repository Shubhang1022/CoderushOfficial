import { Event, EventStatus } from '../types';
import { StorageService } from './storageService';

export class EventService {
  /**
   * Automatically calculates an event's current lifecycle status based on current date & admin publish state.
   */
  static calculateStatus(event: Event): EventStatus {
    if (event.publish_status === false) {
      return 'draft';
    }

    const now = new Date();
    const revealDate = event.reveal_date ? new Date(event.reveal_date) : null;
    const regStart = event.registration_start ? new Date(event.registration_start) : null;
    const regEnd = event.registration_end ? new Date(event.registration_end) : null;
    const eventStart = new Date(event.event_start);
    const eventEnd = new Date(event.event_end);

    // If event is finished
    if (now > eventEnd) {
      if (event.gallery_published) {
        return 'published';
      }
      return 'completed';
    }

    // If event is currently ongoing
    if (now >= eventStart && now <= eventEnd) {
      return 'live';
    }

    // If registration has closed, but event has not started
    if (regEnd && now > regEnd && now < eventStart) {
      return 'registration_closed';
    }

    // If registration is currently open
    if (regStart && regEnd && now >= regStart && now <= regEnd) {
      return 'registration_open';
    }

    // If reveal date has passed, but registration hasn't started
    if (revealDate && regStart && now >= revealDate && now < regStart) {
      return 'registration_opening';
    }

    // Coming soon
    return 'coming_soon';
  }

  /**
   * Retrieves all events with updated dynamic status calculation.
   */
  static getAllEvents(): Event[] {
    const rawEvents = StorageService.getEvents();
    return rawEvents.map(evt => ({
      ...evt,
      status: this.calculateStatus(evt),
    }));
  }

  /**
   * Retrieves public events (excluding drafts).
   */
  static getPublicEvents(): Event[] {
    return this.getAllEvents().filter(evt => evt.status !== 'draft');
  }

  /**
   * Retrieves a single event by slug.
   */
  static getEventBySlug(slug: string): Event | undefined {
    return this.getAllEvents().find(evt => evt.slug === slug);
  }

  /**
   * Retrieves the current featured event.
   */
  static getFeaturedEvent(): Event | undefined {
    return this.getPublicEvents().find(evt => evt.featured) || this.getPublicEvents()[0];
  }

  /**
   * Creates or updates an event.
   */
  static saveEvent(eventData: Partial<Event>): Event {
    const events = StorageService.getEvents();
    let updatedEvent: Event;

    if (eventData.id) {
      const index = events.findIndex(e => e.id === eventData.id);
      if (index !== -1) {
        updatedEvent = {
          ...events[index],
          ...eventData,
          updated_at: new Date().toISOString(),
        } as Event;
        events[index] = updatedEvent;
        StorageService.addLog('Event Updated', `Updated event "${updatedEvent.title}"`);
      } else {
        throw new Error('Event not found');
      }
    } else {
      const newId = 'evt-' + Date.now();
      const slug = eventData.slug || eventData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `event-${Date.now()}`;
      
      updatedEvent = {
        id: newId,
        title: eventData.title || 'Untitled Event',
        slug,
        short_description: eventData.short_description || '',
        full_description: eventData.full_description || '',
        poster: eventData.poster || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
        cover_image: eventData.cover_image,
        category: eventData.category || 'Hackathon',
        mode: eventData.mode || 'In-Person',
        venue: eventData.venue || 'BBDNIIT Campus',
        city: eventData.city || 'Lucknow',
        registration_link: eventData.registration_link,
        feedback_link: eventData.feedback_link,
        reveal_date: eventData.reveal_date,
        registration_start: eventData.registration_start,
        registration_end: eventData.registration_end,
        event_start: eventData.event_start || new Date().toISOString(),
        event_end: eventData.event_end || new Date(Date.now() + 86400000).toISOString(),
        publish_status: eventData.publish_status ?? false,
        featured: eventData.featured ?? false,
        gallery_published: eventData.gallery_published ?? false,
        registration_enabled: eventData.registration_enabled ?? true,
        status: eventData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Event;

      events.unshift(updatedEvent);
      StorageService.addLog('Event Created', `Created event "${updatedEvent.title}"`);
    }

    StorageService.saveEvents(events);
    return updatedEvent;
  }

  /**
   * Toggles public website visibility (Publish vs Draft).
   */
  static togglePublicVisibility(id: string, published: boolean): void {
    const events = StorageService.getEvents();
    const evt = events.find(e => e.id === id);
    if (evt) {
      evt.publish_status = published;
      evt.updated_at = new Date().toISOString();
      StorageService.saveEvents(events);
      StorageService.addLog('Visibility Toggle', `${published ? 'Published' : 'Unpublished (Draft)'} event "${evt.title}"`);
    }
  }

  /**
   * Toggles event highlights & gallery publication (only visible for completed events).
   */
  static toggleGalleryPublished(id: string, published: boolean): void {
    const events = StorageService.getEvents();
    const evt = events.find(e => e.id === id);
    if (evt) {
      evt.gallery_published = published;
      evt.updated_at = new Date().toISOString();
      StorageService.saveEvents(events);
      StorageService.addLog('Highlights Toggle', `${published ? 'Published' : 'Hidden'} highlights for "${evt.title}"`);
    }
  }

  /**
   * Deletes an event by ID.
   */
  static deleteEvent(id: string): void {
    let events = StorageService.getEvents();
    const evt = events.find(e => e.id === id);
    events = events.filter(e => e.id !== id);
    StorageService.saveEvents(events);
    if (evt) {
      StorageService.addLog('Event Deleted', `Deleted event "${evt.title}"`);
    }
  }
}
