import { parseDateStringToDate } from "@helpers/date";
import { SheduledEvents } from "@services/brawl-stars/api/types";

export function template_BS_events(events: SheduledEvents): string {
    const convertedEventsToString = events.map(item => {
        const startDate = parseDateStringToDate(item.startTime)
        const endDate = parseDateStringToDate(item.endTime)
        return (
            `
Карта: ${item.event.map}
Режим: ${item.event.mode}
Начало события: ${startDate.toLocaleString('ru')}
Конец события: ${endDate.toLocaleString('ru')}${Array.isArray(item.event.modifiers) ? "\nМодификаторы: " + item.event.modifiers.join(', ') : ""}.`
        )
    })

    const message = convertedEventsToString.join('\n')

    return message
}

