const Status = {
  INIT: "Initializing",
  NO_BOARD: "No Board",
  READY: "Ready"
} as const;

function getStatusCode(status: typeof Status[keyof typeof Status]): number {
  switch (status) {
    case Status.INIT:
      return 503;
    case Status.NO_BOARD:
      return 500;
    case Status.READY:
      return 200;
    default:
      return 500;
  }
}

module.exports = {
  Status,
  getStatusCode
};