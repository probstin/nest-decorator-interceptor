import { SetMetadata } from "@nestjs/common";

export const CacheKey = auditEvent => SetMetadata('audit-event', auditEvent);
