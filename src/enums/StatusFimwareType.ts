export enum StatusFirmwareType {
  DRAFT = "DRAFT",
  RELEASED = "RELEASED",
  DEPRECATED = "DEPRECATED",
  OUTDATED = "OUTDATED",
}

export const allowedTransitions: Record<
  StatusFirmwareType,
  StatusFirmwareType[]
> = {
  [StatusFirmwareType.DRAFT]: [StatusFirmwareType.DRAFT, StatusFirmwareType.RELEASED],
  [StatusFirmwareType.RELEASED]: [
    StatusFirmwareType.RELEASED,
    StatusFirmwareType.DEPRECATED,
    StatusFirmwareType.OUTDATED,
  ],
  [StatusFirmwareType.DEPRECATED]: [
    StatusFirmwareType.DEPRECATED,
    StatusFirmwareType.RELEASED,
    StatusFirmwareType.OUTDATED,
  ],
  [StatusFirmwareType.OUTDATED]: [StatusFirmwareType.OUTDATED],
};

export function getAllowedNextStatuses(
  current: StatusFirmwareType
): StatusFirmwareType[] {
  return allowedTransitions[current] || [];
}